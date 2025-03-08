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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const invoice_schema_1 = require("./invoice.schema");
const mongoose_2 = require("mongoose");
const orders_service_1 = require("../orders/orders.service");
const order_status_enum_1 = require("../../common/enums/order-status.enum");
const user_schema_1 = require("../users/user.schema");
const delivery_notes_service_1 = require("../delivery-notes/delivery-notes.service");
const delivery_note_status_1 = require("../../common/enums/delivery-note-status");
let InvoicesService = class InvoicesService {
    constructor(invoiceModel, userModel, orderService, deliveryNoteService) {
        this.invoiceModel = invoiceModel;
        this.userModel = userModel;
        this.orderService = orderService;
        this.deliveryNoteService = deliveryNoteService;
    }
    async findOne(invoiceId) {
        return await this.invoiceModel.findById(invoiceId)
            .populate("createdFor", "_id username email phoneNumber location")
            .populate("items.product", "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze")
            .populate("orders", "_id processedAt modifiedAt")
            .populate("createdFor", "_id username email phoneNumber location")
            .exec();
    }
    async findAll(page = 1, limit = 10, search) {
        const query = {};
        if (search) {
            const matchingUsers = await this.userModel
                .find({
                $or: [
                    { username: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            }, "_id")
                .exec();
            const userIds = matchingUsers.map((user) => user._id);
            if (userIds.length > 0) {
                query["createdFor"] = { $in: userIds };
            }
            else {
                return { data: [], total: 0 };
            }
        }
        const [data, total] = await Promise.all([
            this.invoiceModel
                .find(query)
                .populate("createdFor", "_id username email phoneNumber location")
                .populate("items.product", "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze")
                .populate("orders", "_id processedAt modifiedAt")
                .populate("createdFor", "_id username email phoneNumber location")
                .sort({
                "createdAt": -1
            })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.invoiceModel.countDocuments(query).exec(),
        ]);
        return { data, total };
    }
    async createInvoice(createInvoiceDTO) {
        try {
            const orders = await this.orderService.findMultiple(createInvoiceDTO.orders);
            const statusCheck = orders.every((order) => order.status === order_status_enum_1.OrderStatus.ACCEPTED);
            const userCheck = orders.every((order) => order.createdBy.toString() === createInvoiceDTO.createdFor);
            if (!userCheck || !statusCheck) {
                if (!statusCheck) {
                    throw new Error("Non Accepted Orders");
                }
                else {
                    throw new Error("User not the same for all orders");
                }
            }
            const totalPrice = orders.reduce((acc, order) => {
                return acc + order.orderItems.reduce((itemAcc, item) => itemAcc + item.quantity * item.price, 0);
            }, 0);
            const items = orders.map((order) => order.orderItems).flat();
            const deliveryNotes = await this.deliveryNoteService.findManyByOrderIds(createInvoiceDTO.orders);
            if (deliveryNotes.some((note) => {
                return note.status === delivery_note_status_1.DeliveryNoteStatus.INVOICED;
            })) {
                throw new Error("Orders already invoiced");
            }
            await Promise.all(deliveryNotes.map(async (note) => {
                note.status = delivery_note_status_1.DeliveryNoteStatus.INVOICED;
                return await note.save();
            }));
            const invoice = new this.invoiceModel({
                createdFor: new mongoose_2.Types.ObjectId(createInvoiceDTO.createdFor),
                orders: createInvoiceDTO.orders.map((orderId) => new mongoose_2.Types.ObjectId(orderId)),
                items,
                totalPrice
            });
            return await invoice.save();
        }
        catch (error) {
            throw new common_1.BadRequestException("Unable to create invoice ", error.message);
        }
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(invoice_schema_1.Invoice.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        orders_service_1.OrdersService,
        delivery_notes_service_1.DeliveryNotesService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map