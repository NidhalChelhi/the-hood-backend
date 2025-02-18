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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./order.schema");
const products_service_1 = require("../products/products.service");
const order_status_enum_1 = require("../../common/enums/order-status.enum");
const delivery_notes_service_1 = require("../delivery-notes/delivery-notes.service");
const users_service_1 = require("../users/users.service");
const location_rank_enum_1 = require("../../common/enums/location-rank.enum");
const user_schema_1 = require("../users/user.schema");
let OrdersService = class OrdersService {
    constructor(orderModel, userModel, deliveryNoteService, productsService, usersService) {
        this.orderModel = orderModel;
        this.userModel = userModel;
        this.deliveryNoteService = deliveryNoteService;
        this.productsService = productsService;
        this.usersService = usersService;
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
                query["createdBy"] = { $in: userIds };
            }
            else {
                return { data: [], total: 0 };
            }
        }
        const [data, total] = await Promise.all([
            this.orderModel
                .find(query)
                .populate("createdBy", "_id username email phoneNumber location")
                .populate("orderItems.product", "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze")
                .populate("originalOrderItems.product", "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze")
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.orderModel.countDocuments(query).exec(),
        ]);
        return { data, total };
    }
    async findOne(orderId) {
        const order = await this.orderModel
            .findById(orderId)
            .populate("createdBy", "_id username email phoneNumber location")
            .populate("orderItems.product", "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze")
            .populate("originalOrderItems.product", "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze")
            .exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
        }
        return order;
    }
    async findMultiple(orderIds) {
        return await this.orderModel.find({ _id: { $in: orderIds } });
    }
    async createOrder(createOrderDTO) {
        const { createdBy, orderItems } = createOrderDTO;
        const manager = await this.usersService.findOneById(createdBy);
        if (!manager) {
            throw new common_1.NotFoundException(`User with ID ${createdBy} not found`);
        }
        const restaurantRank = manager.location.rank;
        const itemsWithPrices = await Promise.all(orderItems.map(async (item) => {
            const product = await this.productsService.findOne(item.product);
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.product} not found`);
            }
            let price;
            switch (restaurantRank) {
                case location_rank_enum_1.LocationRank.GOLD:
                    price = product.sellingPriceGold;
                    break;
                case location_rank_enum_1.LocationRank.SILVER:
                    price = product.sellingPriceSilver;
                    break;
                case location_rank_enum_1.LocationRank.BRONZE:
                    price = product.sellingPriceBronze;
                    break;
                default:
                    throw new Error(`Invalid restaurant rank: ${restaurantRank}`);
            }
            return {
                product: new mongoose_2.Types.ObjectId(item.product),
                quantity: item.quantity,
                price,
            };
        }));
        const order = new this.orderModel({
            createdBy: new mongoose_2.Types.ObjectId(createdBy),
            restaurantRank,
            orderItems: itemsWithPrices,
            originalOrderItems: itemsWithPrices,
            status: order_status_enum_1.OrderStatus.PENDING,
        });
        await order.save();
        return this.orderModel
            .findById(order._id)
            .populate("createdBy", "_id username email phoneNumber location")
            .populate("orderItems.product", "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze")
            .populate("originalOrderItems.product", "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze")
            .exec();
    }
    async processOrder(orderId, action, modifiedItems) {
        const order = await this.orderModel.findById(orderId).exec();
        if (!order) {
            throw new common_1.NotFoundException(`Commande avec l'ID ${orderId} non trouvée`);
        }
        if (order.status !== order_status_enum_1.OrderStatus.PENDING) {
            throw new Error("La commande a déjà été traitée");
        }
        if (action === "decline") {
            order.status = order_status_enum_1.OrderStatus.DENIED;
            order.processedAt = new Date();
        }
        else if (action === "accept" || action === "modify") {
            const itemsToProcess = action === "modify" ? modifiedItems : order.orderItems;
            if (!itemsToProcess) {
                throw new Error("Les articles sont requis pour accepter ou modifier la commande");
            }
            const quantities = itemsToProcess.map((item) => item.quantity);
            if (quantities.some((quantity) => quantity <= 0)) {
                throw new Error("La quantité doit être supérieure à 0");
            }
            for (const item of itemsToProcess) {
                const product = await this.productsService.findOne(item.product.toString());
                if (!product) {
                    throw new common_1.NotFoundException(`Produit avec l'ID ${item.product} non trouvé`);
                }
                if (product.quantity < item.quantity) {
                    throw new Error(`Stock insuffisant pour le produit ${product.name}`);
                }
            }
            if (action === "modify") {
                order.orderItems = await Promise.all(itemsToProcess.map(async (item) => {
                    const product = await this.productsService.findOne(item.product.toString());
                    if (!product) {
                        throw new common_1.NotFoundException(`Produit avec l'ID ${item.product} non trouvé`);
                    }
                    return {
                        product: new mongoose_2.Types.ObjectId(item.product),
                        quantity: item.quantity,
                        price: item.price,
                    };
                }));
            }
            order.status = order_status_enum_1.OrderStatus.ACCEPTED;
            order.modifiedAt = action === "modify" ? new Date() : undefined;
            order.processedAt = new Date();
            await this.productsService.updateProductStock(order.orderItems);
            await this.deliveryNoteService.createDeliveryNote({
                order: order._id.toString(),
            });
        }
        await order.save();
        return this.orderModel
            .findById(order._id)
            .populate("createdBy", "_id username email phoneNumber location")
            .populate("orderItems.product", "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze")
            .populate("originalOrderItems.product", "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze")
            .exec();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        delivery_notes_service_1.DeliveryNotesService,
        products_service_1.ProductsService,
        users_service_1.UsersService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map