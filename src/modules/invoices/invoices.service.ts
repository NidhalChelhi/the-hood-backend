import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Invoice } from './invoice.schema';
import { Order } from '../orders/orders.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UserInfo } from '../users/types';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class InvoicesService {
    private readonly logger = new Logger(InvoicesService.name);

    constructor(
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
        @InjectModel(Order.name) private readonly orderModel: Model<Order>, // Inject Order model
        private readonly userService: UsersService

    ) { }

    async create(createInvoiceDTO: CreateInvoiceDto): Promise<Invoice> {
        try {
            // Find orders by IDs
            const orders = await this.orderModel.find({
                _id: { $in: createInvoiceDTO.orders },
            });
            // Check if all orders exist
            if (!orders || orders.length != createInvoiceDTO.orders.length) {
                throw new BadRequestException(`Orders with this ids not found`);
            }
            // Ensure all orders belong to the same manager
            const managerIds = new Set(orders.map(order => order.managerId.toString()));
            if (managerIds.size > 1) {
                throw new BadRequestException(`All orders must belong to the same manager.`);
            }
            // Check if any of the orders are already associated with another invoice
            const existingInvoices = await this.invoiceModel.find({
                orders: { $in: createInvoiceDTO.orders },
            });

            if (existingInvoices.length > 0) {
                throw new BadRequestException(`One or more orders are already associated with another invoice`);
            }

            // Check if any of the orders are not marked as Confirmed
            const unconfirmedOrders = orders.filter(order => order.status !== OrderStatus.Confirmed);

            if (unconfirmedOrders.length > 0) {
                throw new BadRequestException(`One or more orders are not marked as Confirmed`);
            }

            // Calculate total price
            const totalPrice = orders.reduce((sum, order) => sum + order.totalPrice, 0);

            const invoice = new this.invoiceModel({
                ...createInvoiceDTO,
                totalPrice,
            });

            const savedInvoice = await invoice.save();

            // Update the status of the orders to Facturated
            await this.orderModel.updateMany(
                { _id: { $in: createInvoiceDTO.orders } },
                { $set: { status: OrderStatus.Facturated } }
            );

            return savedInvoice;

        } catch (error) {
            if (error.code === 11000) {
                throw new BadRequestException(
                    `Invoice with number '${createInvoiceDTO.num}' already exists`,
                );
            }
            this.logger.error('Error creating invoice:', error.message);
            throw new BadRequestException(
                `Failed to create invoice: ${error.message}`,
            );
        }
    }

    async findByManagerName(managerName: string): Promise<Invoice[]> {
        if (!managerName || managerName.trim() === '') {
            throw new BadRequestException(`Manager name cannot be empty.`);
        }

        try {
            // Step 1: Find all users whose username matches the manager name
            const users = await this.userService.findLikeUserName(managerName);
            if (!users.length) {
                throw new BadRequestException(`No users found with the name '${managerName}'`);
            }

            const managerIds = users.map(user => user._id);

            // Step 2: Find invoices where at least one order belongs to these manager IDs
            const invoices = await this.invoiceModel
                .find()
                .populate({
                    path: 'orders',
                    model: 'Order',
                    match: { managerId: { $in: managerIds } },  // Filters orders by manager IDs
                    select: 'managerId productOrders totalPrice status createdAt updatedAt',
                    populate: {
                        path: 'managerId',
                        model: 'User',
                        select: 'username phoneNumber location'
                    }
                })
                .exec();

            // Step 3: Filter invoices that contain at least one matching order
            const filteredInvoices = invoices.filter(invoice => invoice.orders.length > 0);

            if (!filteredInvoices.length) {
                throw new BadRequestException(`No invoices found for manager '${managerName}'`);
            }

            return filteredInvoices;
        } catch (error) {
            this.logger.error(`Error fetching invoices for manager '${managerName}':`, error.message);
            throw new BadRequestException(`Failed to fetch invoices: ${error.message}`);
        }
    }


    async findAll(): Promise<Invoice[]> {
        try {
            return await this.invoiceModel.find()
                .populate({
                    path: 'orders',
                    model: 'Order',
                    select: 'managerId productOrders totalPrice status createdAt updatedAt',
                    populate: {
                        path: 'managerId',
                        model: 'User',
                        select: 'username phoneNumber location'
                    }
                })
                .exec();
        } catch (error) {
            this.logger.error('Error fetching invoices:', error.message);
            throw new BadRequestException(
                `Failed to fetch invoices: ${error.message}`,
            );
        }
    }

    async findOne(id: string): Promise<Invoice> {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidObjectId) {
            throw new BadRequestException(`Invalid invoice ID provided: ${id}`);
        }
        try {
            const invoice = await this.invoiceModel.findById(id)
                .populate({
                    path: 'orders',
                    model: 'Order',
                    select: 'managerId productOrders totalPrice status createdAt updatedAt',
                    populate: {
                        path: 'managerId',
                        model: 'User',
                        select: 'username phoneNumber location'
                    }
                })
                .exec();
            if (!invoice) {
                throw new BadRequestException(`Invoice with id ${id} not found`);
            }
            return invoice;
        } catch (error) {
            this.logger.error('Error fetching invoice:', error.message);
            throw new BadRequestException(
                `Failed to fetch invoice: ${error.message}`,
            );
        }
    }

    async update(
        id: string,
        updateInvoiceDTO: UpdateInvoiceDto,
    ): Promise<Invoice> {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidObjectId) {
            throw new BadRequestException(`Invalid invoice ID provided: ${id}`);
        }
        try {
            const invoice = await this.invoiceModel.findByIdAndUpdate(
                id,
                updateInvoiceDTO,
                { new: true, runValidators: true },
            );
            if (!invoice) {
                throw new BadRequestException(`Invoice with id ${id} not found`);
            }
            // If orders are updated, recalculate the totalPrice
            if (updateInvoiceDTO.orders) {
                const orders = await this.orderModel.find({
                    _id: { $in: updateInvoiceDTO.orders },
                });
                updateInvoiceDTO.totalPrice = orders.reduce(
                    (sum, order) => sum + order.totalPrice,
                    0,
                );
            }
            return invoice;
        } catch (error) {
            this.logger.error('Error updating invoice:', error.message);
            throw new BadRequestException(
                `Failed to update invoice: ${error.message}`,
            );
        }
    }

    async remove(id: string): Promise<void> {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidObjectId) {
            throw new BadRequestException(`Invalid invoice ID provided: ${id}`);
        }
        try {
            const invoice = await this.invoiceModel.findByIdAndDelete(id);
            if (!invoice) {
                throw new BadRequestException(`Invoice with id ${id} not found`);
            }
        } catch (error) {
            this.logger.error('Error deleting invoice:', error.message);
            throw new BadRequestException(
                `Failed to delete invoice: ${error.message}`,
            );
        }
    }
}