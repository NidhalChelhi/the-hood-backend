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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const create_product_order_dto_1 = require("./dto/create-product-order.dto");
const update_product_order_dto_1 = require("./dto/update-product-order.dto");
const product_order_price_dto_1 = require("./dto/product-order-price.dto");
const product_query_dto_1 = require("./dto/product-query.dto");
const search_query_dto_1 = require("../../common/dto/search-query.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let OrdersController = class OrdersController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async create(req, createOrderDTO) {
        const userId = req.user["userId"];
        return await this.orderService.createOrder(createOrderDTO, userId);
    }
    async findAll(queryParams) {
        return await this.orderService.findAllOrders(queryParams);
    }
    async findById(id) {
        return await this.orderService.findById(id);
    }
    async findAllForUser(req, queryParams) {
        return await this.orderService.findOrdersForUser(req.user?.userId, queryParams);
    }
    async addProductOrder(id, createProductOrderDTO) {
        console.log(createProductOrderDTO);
        return await this.orderService.addProductOrder(id, createProductOrderDTO);
    }
    async updateProductOrder(id, product, updateProductOrderDTO) {
        return await this.orderService.updateProductOrder(id, product.productId, updateProductOrderDTO.quantity);
    }
    async deleteProductOrder(id, product) {
        return await this.orderService.deleteProductOrder(id, product.productId);
    }
    async deleteOrder(id) {
        return await this.orderService.deleteOrder(id);
    }
    async getProcessingDetails(id) {
        return await this.orderService.getOrderProcessingDetails(id);
    }
    async validateOrder(id) {
        return await this.orderService.validateOrder(id);
    }
    async validateOrderAveragePrice(id) {
        return await this.orderService.validateOrderWithAveragePrice(id);
    }
    async changeProductOrderPrice(id, product, productOrderPriceDTO) {
        return await this.orderService.changeProductOrderPrice(id, product.productId, productOrderPriceDTO);
    }
    async confirmOrder(id) {
        return await this.orderService.confirmOrder(id);
    }
    async cancelOrder(id) {
        return await this.orderService.refuseOrder(id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDTO]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_query_dto_1.SearchQueryDTO]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)("resto/info"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_query_dto_1.SearchQueryDTO]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAllForUser", null);
__decorate([
    (0, common_1.Post)("product-order/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_product_order_dto_1.CreateProductOrderDTO]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "addProductOrder", null);
__decorate([
    (0, common_1.Patch)("product-order/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_query_dto_1.ProductQueryDTO,
        update_product_order_dto_1.UpdateProductOrderDTO]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateProductOrder", null);
__decorate([
    (0, common_1.Delete)("product-order/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_query_dto_1.ProductQueryDTO]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "deleteProductOrder", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "deleteOrder", null);
__decorate([
    (0, common_1.Get)(":id/details"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getProcessingDetails", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "validateOrder", null);
__decorate([
    (0, common_1.Put)("average-price/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "validateOrderAveragePrice", null);
__decorate([
    (0, common_1.Patch)("valid-order/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_query_dto_1.ProductQueryDTO,
        product_order_price_dto_1.ProductOrderPriceDTO]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "changeProductOrderPrice", null);
__decorate([
    (0, common_1.Patch)("valid-order/confirm/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "confirmOrder", null);
__decorate([
    (0, common_1.Patch)("cancel/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cancelOrder", null);
exports.OrdersController = OrdersController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)("orders"),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map