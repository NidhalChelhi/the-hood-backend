import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Invoice } from './invoice.schema';
import { Order } from '../orders/orders.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UserInfo } from '../users/types';

@Injectable()
export class InvoicesService {
    private readonly logger = new Logger(InvoicesService.name);

    constructor(
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
        @InjectModel(Order.name) private readonly orderModel: Model<Order>, // Inject Order model
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
            // Check if any of the orders are already associated with another invoice
            const existingInvoices = await this.invoiceModel.find({
                orders: { $in: createInvoiceDTO.orders },
            });

            if (existingInvoices.length > 0) {
                throw new BadRequestException(`One or more orders are already associated with another invoice`);
            }

            // Calculate total price
            const totalPrice = orders.reduce((sum, order) => sum + order.totalPrice, 0);

            const invoice = new this.invoiceModel({
                ...createInvoiceDTO,
                totalPrice,
            });

            return await invoice.save();
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