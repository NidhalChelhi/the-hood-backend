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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const orders_schema_1 = require("./orders.schema");
const mongoose_2 = require("mongoose");
const order_status_enum_1 = require("../../common/enums/order-status.enum");
const products_service_1 = require("../products/products.service");
const product_availabilty_enum_1 = require("../../common/enums/product-availabilty.enum");
const location_rank_enum_1 = require("../../common/enums/location-rank.enum");
const users_service_1 = require("../users/users.service");
let OrdersService = OrdersService_1 = class OrdersService {
    constructor(orderModel, productService, userService) {
        this.orderModel = orderModel;
        this.productService = productService;
        this.userService = userService;
        this.logger = new common_1.Logger(OrdersService_1.name);
    }
    async createOrder(createOrderDTO) {
        try {
            const order = new this.orderModel(createOrderDTO);
            order.productOrders = order.originalProductOrders;
            const savedOrder = await order.save();
            const populatedOrder = await savedOrder
                .populate([
                {
                    path: "managerId",
                    select: "username phoneNumber location"
                },
                {
                    path: "originalProductOrders.productId",
                    select: "name",
                }
            ]);
            return populatedOrder;
        }
        catch (error) {
            this.logger.error("Error creating order : ", error.message);
            throw new common_1.BadRequestException(`Failed to create order : ${error.message}`);
        }
    }
    async findAllOrders(searchQuery) {
        try {
            const options = {};
            if (searchQuery.name) {
                const users = await this.userService.findLikeUserName(searchQuery.name);
                const userIds = users.map((user) => user._id);
                options.managerId = { $in: userIds };
            }
            const query = this.orderModel
                .find(options)
                .populate({
                path: "managerId",
                select: "username phoneNumber location"
            })
                .populate({
                path: "productOrders.productId",
                select: "name",
            });
            if (searchQuery.sort) {
                const sortCriteria = (searchQuery.sort == "asc") ? 1 : -1;
                query.sort({
                    "createdAt": sortCriteria
                });
            }
            const pageNumber = Math.max((searchQuery.page || 1), 1);
            const limit = 10;
            const totalElems = await this.countDocs(options);
            const totalPages = Math.ceil(totalElems / limit);
            if (pageNumber > totalPages && totalPages !== 0) {
                throw new common_1.BadRequestException(`Page Number bigger than total pages total Pages : ${totalPages}, your request page number : ${pageNumber}`);
            }
            const orders = await query.skip((pageNumber - 1) * limit).limit(limit).exec();
            return {
                orders,
                pageNumber,
                totalElems,
                totalPages
            };
        }
        catch (error) {
            this.logger.error("Error fetching orders : ", error.message);
            throw new common_1.BadRequestException(`Failed to fetch orders : ${error.message}`);
        }
    }
    async countDocs(options) {
        return await this.orderModel.countDocuments(options).exec();
    }
    async findById(id) {
        try {
            const order = await this.orderModel
                .findById(id)
                .populate({
                path: "managerId",
                select: "username phoneNumber location"
            })
                .populate({
                path: "productOrders.productId",
                select: "name",
            })
                .exec();
            if (!order) {
                throw new common_1.NotFoundException("Order Not Found");
            }
            return order;
        }
        catch (error) {
            this.logger.error(`Error fetching order : ${error.message}`);
            throw new common_1.BadRequestException(`Failed to fetch order : ${error.message}`);
        }
    }
    async findOrdersForUser(userId, searchQuery) {
        try {
            const query = this.orderModel
                .find({ "managerId": new mongoose_2.Types.ObjectId(userId) })
                .populate({
                path: "managerId",
                select: "username phoneNumber location"
            })
                .populate({
                path: "originalProductOrders.productId",
                select: "name",
            });
            if (searchQuery.sort) {
                const sortCriteria = (searchQuery.sort == "asc") ? 1 : -1;
                query.sort({
                    "createdAt": sortCriteria
                });
            }
            const pageNumber = Math.max((searchQuery.page || 1), 1);
            const limit = 10;
            const totalElems = await this.countDocs({ managerId: userId });
            const totalPages = Math.ceil(totalElems / limit);
            if (pageNumber > totalPages && totalPages !== 0) {
                throw new common_1.BadRequestException(`Page Number bigger than total pages total Pages : ${totalPages}, your request page number : ${pageNumber}`);
            }
            const orders = await query.skip((pageNumber - 1) * limit).limit(limit).exec();
            if (!orders) {
                throw new common_1.NotFoundException("User does not have any orders");
            }
            return {
                orders,
                pageNumber,
                totalElems,
                totalPages
            };
        }
        catch (error) {
            this.logger.error(`Error fetching orders for user ${userId} : ${error.message}`);
            throw new common_1.BadRequestException(`Failed to fetch orders for user ${userId} : ${error.message}`);
        }
    }
    async addProductOrder(orderId, createProductOrderDTO) {
        try {
            const order = await this.orderModel.findById(orderId);
            if (order.status === order_status_enum_1.OrderStatus.Confirmed || order.status === order_status_enum_1.OrderStatus.Validated) {
                throw new common_1.UnauthorizedException("Cannot add product to validated / confirmed order");
            }
            const product = order.productOrders.find((productOrder) => {
                return productOrder.productId.toString() === createProductOrderDTO.productId;
            });
            const originalProduct = order.originalProductOrders.find((productOrder) => {
                return productOrder.productId.toString() === createProductOrderDTO.productId;
            });
            if (!product) {
                this.logger.debug(`Wselna lena`);
                await order.updateOne({
                    $push: {
                        productOrders: { ...createProductOrderDTO },
                        originalProductOrders: { ...createProductOrderDTO }
                    }
                }, { new: true, runValidators: true }).exec();
            }
            else {
                product.quantity += createProductOrderDTO.quantity;
                originalProduct.quantity += createProductOrderDTO.quantity;
            }
            const newOrder = await order.save();
            const populatedOrder = await newOrder
                .populate([
                {
                    path: "managerId",
                    select: "username phoneNumber location"
                },
                {
                    path: "originalProductOrders",
                    select: "name",
                }
            ]);
            return populatedOrder;
        }
        catch (error) {
            this.logger.error(`Error adding product order : ${error.message}`);
            throw new common_1.BadRequestException(`Failed to create product order : ${error.message}`);
        }
    }
    async updateProductOrder(orderId, productId, quantity) {
        try {
            const check = await this.findById(orderId);
            if (check.status !== order_status_enum_1.OrderStatus.Pending) {
                throw new common_1.UnauthorizedException("Cannot modify Non Pending Order");
            }
            const order = await this.orderModel
                .findOneAndUpdate({ _id: orderId, "productOrders.productId": productId }, {
                $set: { "productOrders.$.quantity": quantity },
            }, { new: true, runValidators: true })
                .populate({
                path: "managerId",
                select: "username phoneNumber location"
            })
                .populate({
                path: "productOrders",
                select: "name",
            })
                .exec();
            return order;
        }
        catch (error) {
            this.logger.error(`Error updating product order : ${error}`);
            throw new common_1.BadRequestException(`Failed to update product order : ${error.message}`);
        }
    }
    async deleteOrder(orderId) {
        try {
            const check = await this.findById(orderId);
            if (check.status === order_status_enum_1.OrderStatus.Confirmed || check.status === order_status_enum_1.OrderStatus.Validated) {
                throw new common_1.UnauthorizedException("Cannot delete Validated / Confirmed Order");
            }
            const order = await this.orderModel.findByIdAndDelete(orderId).exec();
            if (!order) {
                throw new common_1.NotFoundException("Commande Id Not Found");
            }
            return order;
        }
        catch (error) {
            this.logger.error(`Error deleting order : ${error.message}`);
            throw new common_1.BadRequestException(`Failed to delete order : ${error.message}`);
        }
    }
    async deleteProductOrder(orderId, productId) {
        try {
            const check = await this.findById(orderId);
            if (check.status === order_status_enum_1.OrderStatus.Validated || check.status === order_status_enum_1.OrderStatus.Confirmed) {
                throw new common_1.UnauthorizedException("Cannot modify Validated / Confirmed Order");
            }
            const order = await this.orderModel
                .findByIdAndUpdate(orderId, {
                $pull: { originalProductOrders: { productId: productId }, productOrders: { productId: productId } }
            }, {
                new: true,
                runValidators: true
            })
                .populate({
                path: "managerId",
                select: "username phoneNumber location"
            })
                .populate({
                path: "originalProductOrders.productId",
                select: "name",
            })
                .exec();
            return order;
        }
        catch (error) {
            this.logger.error(`Error deleting product order : ${error.message}`);
            throw new common_1.BadRequestException(`Failed to delete product order : ${error.message}`);
        }
    }
    async getOrderProcessingDetails(orderId) {
        try {
            const order = await this.orderModel.findById(orderId).populate({
                path: "managerId"
            }).exec();
            if (!order) {
                throw new common_1.NotFoundException(`Could not find order ${orderId}`);
            }
            const managerRank = order.managerId.location.rank;
            const productDetails = await Promise.all(order.productOrders.map(async (productOrder) => {
                try {
                    const product = await this.productService.findProductById(productOrder.productId.toString());
                    const totalQuantity = await this.productService.getProductStock(productOrder.productId.toString());
                    const prices = await this.productService.getProductAveragePrice(productOrder.productId.toString());
                    const newQuantity = totalQuantity - productOrder.quantity;
                    return {
                        productName: product.name,
                        orderQuantity: productOrder.quantity,
                        averageUnitPurchasePrice: prices.averagePurchasePrice,
                        averageRankSellingPrice: (managerRank === location_rank_enum_1.LocationRank.Gold)
                            ? prices.averageSellingPriceGold
                            : (managerRank === location_rank_enum_1.LocationRank.Silver)
                                ? prices.averageSellingPriceSilver
                                : prices.averageSellingPriceBronze,
                        totalQuantity,
                        newQuantity: (newQuantity < 0) ? 0 : newQuantity,
                        productStatus: (newQuantity < 0)
                            ? product_availabilty_enum_1.ProductAvailability.NotAvailable
                            : (newQuantity <= product.stockLimit)
                                ? product_availabilty_enum_1.ProductAvailability.BelowStockLimit
                                : product_availabilty_enum_1.ProductAvailability.Available,
                    };
                }
                catch (error) {
                    this.logger.error(`Error Fetching Product ${productOrder.productId} : ${error.message}`);
                    throw new common_1.NotFoundException(`Failed to fetch productc ${productOrder.productId} : ${error.message}`);
                }
            }));
            return productDetails;
        }
        catch (error) {
            this.logger.error(`Error fetching order processing details: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to fetch order processing details : ${error.message}`);
        }
    }
    async refuseOrder(orderId) {
        try {
            const order = await this.orderModel.findById(orderId);
            for (const productOrder of order.originalProductOrders) {
                productOrder.quantity = 0;
            }
            order.updateOne({
                $set: { productOrders: [] }
            });
            order.status = order_status_enum_1.OrderStatus.Rejected;
            order.save();
            const populatedOrder = await order
                .populate([
                {
                    path: "managerId",
                    select: "username phoneNumber location"
                },
                {
                    path: "productOrders",
                    select: "name",
                }
            ]);
            return populatedOrder;
        }
        catch (error) {
            this.logger.error(`Error refusing order : ${error.message}`);
            throw new common_1.BadRequestException(`Failed to refuse order ${error.message}`);
        }
    }
    async validateOrder(orderId) {
        try {
            const order = await this.orderModel
                .findById(orderId)
                .populate({
                path: "managerId",
                select: "username phoneNumber location"
            })
                .populate({
                path: "productOrders.productId",
                populate: {
                    path: "supplyBatchIds"
                }
            })
                .populate({
                path: "originalProductOrders.productId",
                populate: {
                    path: "supplyBatchIds"
                }
            })
                .exec();
            if (!order) {
                throw new common_1.NotFoundException(`Failed to fetch order ${orderId}`);
            }
            if (order.status !== order_status_enum_1.OrderStatus.Pending) {
                throw new common_1.UnauthorizedException("Order must be pending to validate it");
            }
            const processingDetails = await this.getOrderProcessingDetails(orderId);
            if (!processingDetails.every((product) => {
                return product.productStatus !== product_availabilty_enum_1.ProductAvailability.NotAvailable;
            })) {
                this.logger.error("Called Validate Order with Unsufficient quantites for the product list");
                throw new common_1.PreconditionFailedException("All products must be available before validating an order");
            }
            order.totalPrice = 0;
            const res = [];
            for (const productOrder of order.productOrders) {
                const productUsedBatches = await this.productService.retrieveNormalProductStock(productOrder.productId._id.toString(), productOrder.quantity, order.managerId.location.rank);
                productOrder.$set("productOrderInfo", productUsedBatches);
                productOrder.productOrderInfo.productPrice = productOrder.productOrderInfo.usedBatches.reduce((acc, batch) => {
                    return acc + (batch.quantityUsed * batch.sellingPrice);
                }, 0);
                productOrder.productOrderInfo.productUnitPrice = productOrder.productOrderInfo.productPrice / productOrder.quantity;
                res.push(productOrder.productOrderInfo);
                order.totalPrice += productOrder.productOrderInfo.productPrice;
            }
            order.status = order_status_enum_1.OrderStatus.Validated;
            order.save();
            return {
                productsDetails: res,
                totalPrice: order.totalPrice
            };
        }
        catch (error) {
            this.logger.error(`Error validating order: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to validate order: ${error.message}`);
        }
    }
    async validateOrderWithAveragePrice(orderId) {
        try {
            const order = await this.orderModel
                .findById(orderId)
                .populate({
                path: "managerId",
                select: "username phoneNumber location"
            })
                .populate({
                path: "productOrders.productId",
                populate: {
                    path: "supplyBatchIds"
                }
            })
                .exec();
            if (!order) {
                throw new common_1.NotFoundException(`Failed to fetch order ${orderId}`);
            }
            if (order.status !== order_status_enum_1.OrderStatus.Pending) {
                throw new common_1.UnauthorizedException("Order must be pending to validate it");
            }
            const processingDetails = await this.getOrderProcessingDetails(orderId);
            if (!processingDetails.every((product) => {
                return product.productStatus !== product_availabilty_enum_1.ProductAvailability.NotAvailable;
            })) {
                this.logger.error("Called Validate Order with Unsufficient quantites for the product list");
                throw new common_1.PreconditionFailedException("All products must be available before validating an order");
            }
            order.totalPrice = 0;
            const res = [];
            for (const productOrder of order.productOrders) {
                const productUsedBatches = await this.productService.retrieveNormalProductStock(productOrder.productId._id.toString(), productOrder.quantity, order.managerId.location.rank);
                productOrder.$set("productOrderInfo", productUsedBatches);
                const prices = await this.productService.getProductAveragePrice(productOrder.productId._id.toString());
                productOrder.productOrderInfo.productUnitPrice = (order.managerId.location.rank === location_rank_enum_1.LocationRank.Gold)
                    ? prices.averageSellingPriceGold
                    : (order.managerId.location.rank === location_rank_enum_1.LocationRank.Silver)
                        ? prices.averageSellingPriceSilver
                        : prices.averageSellingPriceBronze;
                productOrder.productOrderInfo.productPrice = productOrder.productOrderInfo.productUnitPrice * productOrder.quantity;
                res.push(productOrder.productOrderInfo);
                order.totalPrice += productOrder.productOrderInfo.productPrice;
            }
            order.status = order_status_enum_1.OrderStatus.Validated;
            order.save();
            return {
                productsDetails: res,
                totalPrice: order.totalPrice
            };
        }
        catch (error) {
            this.logger.error(`Error validating order: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to validate order: ${error.message}`);
        }
    }
    async changeProductOrderPrice(orderId, productId, productOrderPriceDTO) {
        try {
            const order = await this.orderModel.findById(orderId);
            if (order.status !== order_status_enum_1.OrderStatus.Validated) {
                throw new common_1.UnauthorizedException("Order is either confirmed or has not been validated yet");
            }
            for (const productOrder of order.productOrders) {
                if (productOrder.productId.toString() === productId) {
                    if (!productOrderPriceDTO.productPrice && productOrderPriceDTO.productUnitPrice) {
                        order.totalPrice -= productOrder.productOrderInfo.productUnitPrice * productOrder.quantity;
                        productOrder.productOrderInfo.productUnitPrice = productOrderPriceDTO.productUnitPrice;
                        productOrder.productOrderInfo.productPrice = productOrder.productOrderInfo.productUnitPrice * productOrder.quantity;
                        order.totalPrice += productOrder.productOrderInfo.productPrice;
                    }
                    else if (!productOrderPriceDTO.productUnitPrice && productOrderPriceDTO.productPrice) {
                        order.totalPrice -= productOrder.productOrderInfo.productPrice;
                        productOrder.productOrderInfo.productPrice = productOrderPriceDTO.productPrice;
                        productOrder.productOrderInfo.productUnitPrice = productOrder.productOrderInfo.productPrice / productOrder.quantity;
                        order.totalPrice += productOrder.productOrderInfo.productPrice;
                    }
                    else {
                        throw new common_1.BadRequestException("Changing Product Order Price must either contain unit price or total price");
                    }
                    order.save();
                    return {
                        productDetails: productOrder,
                        totalPrice: order.totalPrice
                    };
                }
            }
        }
        catch (error) {
            this.logger.error(`Error changing product order price: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to change product order price: ${error.message}`);
        }
    }
    async confirmOrder(orderId) {
        try {
            const check = await this.findById(orderId);
            if (check.status !== order_status_enum_1.OrderStatus.Validated) {
                throw new common_1.UnauthorizedException("Order must be validated to be confirmed");
            }
            const order = await this.orderModel
                .findByIdAndUpdate(orderId, {
                $set: { status: order_status_enum_1.OrderStatus.Confirmed }
            }, { new: true, runValidators: true })
                .populate({
                path: "managerId",
                select: "username phoneNumber location"
            })
                .populate({
                path: "productOrders.productId",
                select: "name",
            })
                .exec();
            return order;
        }
        catch (error) {
            this.logger.error(`Error confirming order : ${error.message}`);
            throw new common_1.BadRequestException(`Failed to confirm order : ${error.message}`);
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(orders_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService,
        users_service_1.UsersService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map