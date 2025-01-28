"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InvoicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const invoice_schema_1 = require("./invoice.schema");
const orders_schema_1 = require("../orders/orders.schema");
const order_status_enum_1 = require("../../common/enums/order-status.enum");
const users_service_1 = require("../users/users.service");
let InvoicesService = InvoicesService_1 = class InvoicesService {
    constructor(invoiceModel, orderModel, userService) {
        this.invoiceModel = invoiceModel;
        this.orderModel = orderModel;
        this.userService = userService;
        this.logger = new common_1.Logger(InvoicesService_1.name);
    }
    async create(createInvoiceDTO) {
        try {
            const orders = await this.orderModel.find({
                _id: { $in: createInvoiceDTO.orders },
            });
            if (!orders || orders.length != createInvoiceDTO.orders.length) {
                throw new common_1.BadRequestException(`Orders with this ids not found`);
            }
            const managerIds = new Set(orders.map(order => order.managerId.toString()));
            if (managerIds.size > 1) {
                throw new common_1.BadRequestException(`All orders must belong to the same manager.`);
            }
            const existingInvoices = await this.invoiceModel.find({
                orders: { $in: createInvoiceDTO.orders },
            });
            if (existingInvoices.length > 0) {
                throw new common_1.BadRequestException(`One or more orders are already associated with another invoice`);
            }
            const unconfirmedOrders = orders.filter(order => order.status !== order_status_enum_1.OrderStatus.Confirmed);
            if (unconfirmedOrders.length > 0) {
                throw new common_1.BadRequestException(`One or more orders are not marked as Confirmed`);
            }
            const totalPrice = orders.reduce((sum, order) => sum + order.totalPrice, 0);
            const invoice = new this.invoiceModel({
                ...createInvoiceDTO,
                totalPrice,
            });
            const savedInvoice = await invoice.save();
            await this.orderModel.updateMany({ _id: { $in: createInvoiceDTO.orders } }, { $set: { status: order_status_enum_1.OrderStatus.Facturated } });
            return savedInvoice;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException(`Invoice with number '${createInvoiceDTO.num}' already exists`);
            }
            this.logger.error('Error creating invoice:', error.message);
            throw new common_1.BadRequestException(`Failed to create invoice: ${error.message}`);
        }
    }
    async findByManagerName(managerName) {
        if (!managerName || managerName.trim() === '') {
            throw new common_1.BadRequestException(`Manager name cannot be empty.`);
        }
        try {
            const users = await this.userService.findLikeUserName(managerName);
            if (!users.length) {
                throw new common_1.BadRequestException(`No users found with the name '${managerName}'`);
            }
            const managerIds = users.map(user => user._id);
            const invoices = await this.invoiceModel
                .find()
                .populate({
                path: 'orders',
                model: 'Order',
                match: { managerId: { $in: managerIds } },
                select: 'managerId productOrders totalPrice status createdAt updatedAt',
                populate: {
                    path: 'managerId',
                    model: 'User',
                    select: 'username phoneNumber location'
                }
            })
                .exec();
            const filteredInvoices = invoices.filter(invoice => invoice.orders.length > 0);
            if (!filteredInvoices.length) {
                throw new common_1.BadRequestException(`No invoices found for manager '${managerName}'`);
            }
            return filteredInvoices;
        }
        catch (error) {
            this.logger.error(`Error fetching invoices for manager '${managerName}':`, error.message);
            throw new common_1.BadRequestException(`Failed to fetch invoices: ${error.message}`);
        }
    }
    async findAll() {
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
        }
        catch (error) {
            this.logger.error('Error fetching invoices:', error.message);
            throw new common_1.BadRequestException(`Failed to fetch invoices: ${error.message}`);
        }
    }
    async findOne(id) {
        const isValidObjectId = mongoose_2.default.Types.ObjectId.isValid(id);
        if (!isValidObjectId) {
            throw new common_1.BadRequestException(`Invalid invoice ID provided: ${id}`);
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
                throw new common_1.BadRequestException(`Invoice with id ${id} not found`);
            }
            return invoice;
        }
        catch (error) {
            this.logger.error('Error fetching invoice:', error.message);
            throw new common_1.BadRequestException(`Failed to fetch invoice: ${error.message}`);
        }
    }
    async update(id, updateInvoiceDTO) {
        const isValidObjectId = mongoose_2.default.Types.ObjectId.isValid(id);
        if (!isValidObjectId) {
            throw new common_1.BadRequestException(`Invalid invoice ID provided: ${id}`);
        }
        try {
            const invoice = await this.invoiceModel.findByIdAndUpdate(id, updateInvoiceDTO, { new: true, runValidators: true });
            if (!invoice) {
                throw new common_1.BadRequestException(`Invoice with id ${id} not found`);
            }
            if (updateInvoiceDTO.orders) {
                const orders = await this.orderModel.find({
                    _id: { $in: updateInvoiceDTO.orders },
                });
                updateInvoiceDTO.totalPrice = orders.reduce((sum, order) => sum + order.totalPrice, 0);
            }
            return invoice;
        }
        catch (error) {
            this.logger.error('Error updating invoice:', error.message);
            throw new common_1.BadRequestException(`Failed to update invoice: ${error.message}`);
        }
    }
    async remove(id) {
        const isValidObjectId = mongoose_2.default.Types.ObjectId.isValid(id);
        if (!isValidObjectId) {
            throw new common_1.BadRequestException(`Invalid invoice ID provided: ${id}`);
        }
        try {
            const invoice = await this.invoiceModel.findByIdAndDelete(id);
            if (!invoice) {
                throw new common_1.BadRequestException(`Invoice with id ${id} not found`);
            }
        }
        catch (error) {
            this.logger.error('Error deleting invoice:', error.message);
            throw new common_1.BadRequestException(`Failed to delete invoice: ${error.message}`);
        }
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = InvoicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(invoice_schema_1.Invoice.name)),
    __param(1, (0, mongoose_1.InjectModel)(orders_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map