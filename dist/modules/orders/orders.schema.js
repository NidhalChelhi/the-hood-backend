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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.ProductOrderSchema = exports.Order = exports.ProductOrder = exports.ProductOrderBatchesInfoSchema = exports.ProductOrderBatchesInfo = exports.NormalProductUsedBatchSchema = exports.NormalProductUsedBatchClass = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_status_enum_1 = require("../../common/enums/order-status.enum");
let NormalProductUsedBatchClass = class NormalProductUsedBatchClass extends mongoose_2.Document {
};
exports.NormalProductUsedBatchClass = NormalProductUsedBatchClass;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NormalProductUsedBatchClass.prototype, "batchId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NormalProductUsedBatchClass.prototype, "quantityUsed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NormalProductUsedBatchClass.prototype, "purchasePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NormalProductUsedBatchClass.prototype, "sellingPrice", void 0);
exports.NormalProductUsedBatchClass = NormalProductUsedBatchClass = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], NormalProductUsedBatchClass);
exports.NormalProductUsedBatchSchema = mongoose_1.SchemaFactory.createForClass(NormalProductUsedBatchClass);
let ProductOrderBatchesInfo = class ProductOrderBatchesInfo extends mongoose_2.Document {
};
exports.ProductOrderBatchesInfo = ProductOrderBatchesInfo;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductOrderBatchesInfo.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [NormalProductUsedBatchClass],
        required: true,
        default: []
    }),
    __metadata("design:type", Array)
], ProductOrderBatchesInfo.prototype, "usedBatches", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ProductOrderBatchesInfo.prototype, "productPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: 0
    }),
    __metadata("design:type", Number)
], ProductOrderBatchesInfo.prototype, "productUnitPrice", void 0);
exports.ProductOrderBatchesInfo = ProductOrderBatchesInfo = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ProductOrderBatchesInfo);
exports.ProductOrderBatchesInfoSchema = mongoose_1.SchemaFactory.createForClass(ProductOrderBatchesInfo);
let ProductOrder = class ProductOrder extends mongoose_2.Document {
};
exports.ProductOrder = ProductOrder;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "Product",
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductOrder.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ProductOrder.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: ProductOrderBatchesInfo,
        required: false,
    }),
    __metadata("design:type", ProductOrderBatchesInfo)
], ProductOrder.prototype, "productOrderInfo", void 0);
exports.ProductOrder = ProductOrder = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, _id: false })
], ProductOrder);
let Order = class Order extends mongoose_2.Document {
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "User",
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "managerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [ProductOrder],
    }),
    __metadata("design:type", Array)
], Order.prototype, "productOrders", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [ProductOrder],
        required: true,
    }),
    __metadata("design:type", Array)
], Order.prototype, "originalProductOrders", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Order.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Object.values(order_status_enum_1.OrderStatus), default: order_status_enum_1.OrderStatus.Pending }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Order);
exports.ProductOrderSchema = mongoose_1.SchemaFactory.createForClass(ProductOrder);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
//# sourceMappingURL=orders.schema.js.map