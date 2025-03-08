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
exports.DeliveryNotesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const delivery_note_schema_1 = require("./delivery-note.schema");
const user_schema_1 = require("../users/user.schema");
const order_schema_1 = require("../orders/order.schema");
const delivery_note_status_1 = require("../../common/enums/delivery-note-status");
let DeliveryNotesService = class DeliveryNotesService {
    constructor(deliveryNoteModel, userModel, orderModel) {
        this.deliveryNoteModel = deliveryNoteModel;
        this.userModel = userModel;
        this.orderModel = orderModel;
    }
    async createDeliveryNote(createDeliveryNoteDTO) {
        const deliveryNote = new this.deliveryNoteModel(createDeliveryNoteDTO);
        await deliveryNote.save();
        return deliveryNote;
    }
    async findAll(page = 1, limit = 10, search, filter) {
        const query = {};
        if (filter && filter !== "all") {
            query["status"] = filter;
        }
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
                const matchingOrders = await this.orderModel
                    .find({ createdBy: { $in: userIds } }, "_id")
                    .exec();
                const orderIds = matchingOrders.map((order) => order._id);
                if (orderIds.length > 0) {
                    query["order"] = { $in: orderIds };
                }
                else {
                    return { data: [], total: 0 };
                }
            }
            else {
                return { data: [], total: 0 };
            }
        }
        const [data, total] = await Promise.all([
            this.deliveryNoteModel
                .find(query)
                .populate({
                path: "order",
                populate: [
                    {
                        path: "createdBy",
                        model: "User",
                        select: "_id username email phoneNumber location",
                    },
                    {
                        path: "orderItems.product",
                        model: "Product",
                    },
                    {
                        path: "originalOrderItems.product",
                        model: "Product",
                    },
                ],
            })
                .sort({
                "createdAt": -1
            })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.deliveryNoteModel.countDocuments(query).exec(),
        ]);
        return { data, total };
    }
    async findOne(deliveryNoteId) {
        const deliveryNote = this.deliveryNoteModel
            .findById(deliveryNoteId)
            .populate({
            path: "order",
            populate: {
                path: "createdBy",
                model: "User",
                select: "_id username email phoneNumber location",
            },
        })
            .populate({
            path: "order",
            populate: {
                path: "orderItems.product",
                model: "Product",
            },
        })
            .populate({
            path: "order",
            populate: {
                path: "originalOrderItems.product",
                model: "Product",
            },
        })
            .exec();
        if (!deliveryNote) {
            throw new common_1.NotFoundException(`Delivery note with ID ${deliveryNoteId} not found`);
        }
        return deliveryNote;
    }
    async findPending() {
        return await this.deliveryNoteModel.find({ status: delivery_note_status_1.DeliveryNoteStatus.PENDING })
            .populate({
            path: "order",
            populate: {
                path: "createdBy",
                model: "User",
                select: "_id username email phoneNumber location",
            },
        })
            .populate({
            path: "order",
            populate: {
                path: "orderItems.product",
                model: "Product",
            },
        })
            .populate({
            path: "order",
            populate: {
                path: "originalOrderItems.product",
                model: "Product",
            },
        })
            .exec();
    }
    async findOneByOrderId(orderId) {
        return await this.deliveryNoteModel.findOne({ order: new mongoose_2.Types.ObjectId(orderId) });
    }
    async findManyByOrderIds(ordersId) {
        return await this.deliveryNoteModel.find({ order: { $in: ordersId.map((elem) => new mongoose_2.Types.ObjectId(elem)) } });
    }
};
exports.DeliveryNotesService = DeliveryNotesService;
exports.DeliveryNotesService = DeliveryNotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(delivery_note_schema_1.DeliveryNote.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DeliveryNotesService);
//# sourceMappingURL=delivery-notes.service.js.map