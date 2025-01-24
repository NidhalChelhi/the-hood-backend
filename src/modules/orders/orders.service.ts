import { BadRequestException, Injectable, Logger, NotFoundException, PreconditionFailedException, UnauthorizedException} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order, ProductOrderBatchesInfo } from "./orders.schema";
import { Model, RootFilterQuery, Types } from "mongoose";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { NamedProductOrder, OrderInfo, OriginalOrderInfo, ProductOrderProcessingDetails, ValidatedOrderInfo } from "./types";
import { UserInfo } from "../users/types";
import { CreateProductOrderDTO } from "./dto/create-product-order.dto";
import { OrderStatus } from "../../common/enums/order-status.enum";
import { ProductsService } from "../products/products.service";
import { ProductAvailability } from "../../common/enums/product-availabilty.enum";
import { Product } from "../products/product.schema";
import { ProductOrderPriceDTO } from "./dto/product-order-price.dto";
import { LocationRank } from "../../common/enums/location-rank.enum";
import { UsersService } from "../users/users.service";
import { SearchQueryDTO } from "../../common/dto/search-query.dto";
import { PaginatedOrders } from "./dto/paginated-order.dto";
import { User } from "../users/user.schema";

@Injectable()
export class OrdersService{
    private readonly logger = new Logger(OrdersService.name);
    constructor(
        @InjectModel(Order.name) private readonly orderModel : Model<Order>,
        private readonly productService : ProductsService,
        private readonly userService : UsersService
    ){}

    async createOrder(createOrderDTO : CreateOrderDTO) : Promise<OriginalOrderInfo>{
        try {
            const order = new this.orderModel(createOrderDTO);
            order.productOrders = order.originalProductOrders;
            const savedOrder = await order.save();
            const populatedOrder = await savedOrder
            .populate<{managerId : UserInfo, originalProductOrders : NamedProductOrder[]}>([
                {
                    path : "managerId",
                    select : "username phoneNumber location"
                },
                {
                    path : "originalProductOrders.productId",
                    select : "name",
                }
            ])
            return populatedOrder as OriginalOrderInfo;
        }catch (error){
            this.logger.error("Error creating order : ", error.message);
            throw new BadRequestException(`Failed to create order : ${error.message}`)
        }
    }
    async findAllOrders(searchQuery? : SearchQueryDTO) : Promise<PaginatedOrders> {
        try{
            const options  : RootFilterQuery<Order> = {}
            if(searchQuery.name){
                const users = await this.userService.findLikeUserName(searchQuery.name);
                const userIds = users.map((user) => user._id);
                options.managerId = { $in : userIds};
            }
            if(searchQuery.status){
                options.status = { $in : searchQuery.status};
            }
            const query = this.orderModel
            .find(options)
            .populate<{managerId : UserInfo}>({
                path : "managerId",
                select : "username phoneNumber location"
            })
            .populate<{ productOrders : NamedProductOrder[]}>({
                path : "productOrders.productId",
                select : "name",
            })

            if(searchQuery.sort){
                const sortCriteria = (searchQuery.sort == "asc") ? 1 : -1;
                query.sort({
                    "createdAt" : sortCriteria
                })
            }
            const pageNumber = Math.max((searchQuery.page || 1), 1);
            const limit = 10;
            const totalElems = await this.countDocs(options);
            const totalPages = Math.ceil(totalElems / limit)
            if(pageNumber > totalPages && totalPages !== 0){
                throw new BadRequestException(`Page Number bigger than total pages total Pages : ${totalPages}, your request page number : ${pageNumber}`);
            }
            const orders : OrderInfo[] = await query.skip((pageNumber - 1) * limit).limit(limit).exec()
            return {
                orders,
                pageNumber,
                totalElems,
                totalPages 
            };

        }catch (error){
            this.logger.error("Error fetching orders : ", error.message);
            throw new BadRequestException(`Failed to fetch orders : ${error.message}`)
        }
    }

    async countDocs(options? : RootFilterQuery<Order>) : Promise<number> {
        return await this.orderModel.countDocuments(options).exec();
    }

    async findById(id : string) : Promise<OrderInfo>{
        try{
            const order = await this.orderModel
            .findById(id)
            .populate<{managerId : UserInfo}>({
                path : "managerId",
                select : "username phoneNumber location"
            })
            .populate<{ productOrders : NamedProductOrder[]}>({
                path : "productOrders.productId",
                select : "name",
            })
            .exec();
            if(!order){
                throw new NotFoundException("Order Not Found");
            }
            return order;
        }catch (error){
            this.logger.error(`Error fetching order : ${error.message}`);
            throw new BadRequestException(`Failed to fetch order : ${error.message}`)
        }
    }

    async findOrdersForUser(userId : string, searchQuery? : SearchQueryDTO){
        try{
            const query =  this.orderModel
            .find({ "managerId" : new Types.ObjectId(userId)})
            .populate<{managerId : UserInfo}>({
                path : "managerId",
                select : "username phoneNumber location"
            })
            .populate<{ originalProductOrders : NamedProductOrder[]}>({
                path : "originalProductOrders.productId",
                select : "name",
            })

            if(searchQuery.sort){
                const sortCriteria = (searchQuery.sort == "asc") ? 1 : -1;
                query.sort({
                    "createdAt" : sortCriteria
                })
            }
            const pageNumber = Math.max((searchQuery.page || 1), 1);
            const limit = 10;
            const totalElems = await this.countDocs({managerId : userId});
            const totalPages = Math.ceil(totalElems / limit)
            if(pageNumber > totalPages && totalPages !== 0){
                throw new BadRequestException(`Page Number bigger than total pages total Pages : ${totalPages}, your request page number : ${pageNumber}`);
            }

            const orders : OriginalOrderInfo[] = await query.skip((pageNumber - 1) * limit).limit(limit).exec();
            if(!orders){
                throw new NotFoundException("User does not have any orders");
            }
            return {
                orders,
                pageNumber,
                totalElems,
                totalPages 
            };
        }catch (error){
            this.logger.error(`Error fetching orders for user ${userId} : ${error.message}`);
            throw new BadRequestException(`Failed to fetch orders for user ${userId} : ${error.message}`)
        }
    }

    async addProductOrder(orderId : string, createProductOrderDTO : CreateProductOrderDTO) : Promise<OriginalOrderInfo>{
        try{
            const order = await this.orderModel.findById(orderId);
            if(order.status === OrderStatus.Confirmed || order.status === OrderStatus.Validated){
                throw new UnauthorizedException("Cannot add product to validated / confirmed order");
            }
            const product = order.productOrders.find((productOrder) => {
                return productOrder.productId.toString() === createProductOrderDTO.productId;
            });
            const originalProduct = order.originalProductOrders.find((productOrder) => {
                return productOrder.productId.toString() === createProductOrderDTO.productId;
            })
            if(!product){
                this.logger.debug(`Wselna lena`)
                await order.updateOne({
                    $push : {
                        productOrders : {...createProductOrderDTO},
                        originalProductOrders : {...createProductOrderDTO}
                    }
                }, {new : true, runValidators : true}).exec();
            }else{
               product.quantity += createProductOrderDTO.quantity; 
               originalProduct.quantity += createProductOrderDTO.quantity; 
            }
            const newOrder = await order.save();
            const populatedOrder = await newOrder
            .populate<{managerId : UserInfo, originalProductOrders : NamedProductOrder[]}>([
                {
                    path : "managerId",
                    select : "username phoneNumber location"
                },
                {
                    path : "originalProductOrders",
                    select : "name",
                }
            ])

            return populatedOrder as OriginalOrderInfo;
        }catch(error){
            this.logger.error(`Error adding product order : ${error.message}`);
            throw new BadRequestException(`Failed to create product order : ${error.message}`)
        }
    }

    async updateProductOrder(orderId : string, productId : string,quantity : number ): Promise<OrderInfo> {
        try{
            const check = await this.findById(orderId);
            if(check.status !== OrderStatus.Pending){
                throw new UnauthorizedException("Cannot modify Non Pending Order");
            }
            const order = await this.orderModel
            .findOneAndUpdate({_id : orderId, "productOrders.productId" : productId}, {
                    $set : {"productOrders.$.quantity" : quantity},
                },
                {new : true, runValidators : true}
            )
            .populate<{managerId : UserInfo}>({
                path : "managerId",
                select : "username phoneNumber location"
            })
            .populate<{ productOrders : NamedProductOrder[]}>({
                path : "productOrders",
                select : "name",
            })
            .exec();
            return order as OrderInfo;
        }catch(error){
            this.logger.error(`Error updating product order : ${error}`);
            throw new BadRequestException(`Failed to update product order : ${error.message}`)
        }
    }
    async deleteOrder(orderId : string) : Promise<Omit<Order , "originalProductOrders" | "status" | "totalPrice" >>{
        try {
            const check = await this.findById(orderId);
            if(check.status === OrderStatus.Confirmed || check.status === OrderStatus.Validated){
                throw new UnauthorizedException("Cannot delete Validated / Confirmed Order");
            }
            const order = await this.orderModel.findByIdAndDelete(orderId).exec();
            if(!order){
                throw new NotFoundException("Commande Id Not Found");
            }
            return order;
        } catch(error){
            this.logger.error(`Error deleting order : ${error.message}`);
            throw new BadRequestException(`Failed to delete order : ${error.message}`)
        }
    }
    async deleteProductOrder(orderId : string, productId : string) : Promise<OriginalOrderInfo>{
        try{
            const check = await this.findById(orderId);
            if(check.status === OrderStatus.Validated || check.status === OrderStatus.Confirmed){
                throw new UnauthorizedException("Cannot modify Validated / Confirmed Order");
            }
            const order = await this.orderModel
            .findByIdAndUpdate(orderId, {
                    $pull : { originalProductOrders : {productId : productId}, productOrders : {productId : productId} }
                },
                { 
                    new : true,
                    runValidators : true
                }
            )
            .populate<{managerId : UserInfo}>({
                path : "managerId",
                select : "username phoneNumber location"
            })
            .populate<{ originalProductOrders : NamedProductOrder[]}>({
                path : "originalProductOrders.productId",
                select : "name",
            })
            .exec();
            return order as OriginalOrderInfo;
        }catch(error){
            this.logger.error(`Error deleting product order : ${error.message}`);
            throw new BadRequestException(`Failed to delete product order : ${error.message}`)
        }
    }
    async getOrderProcessingDetails(orderId : string) : Promise<ProductOrderProcessingDetails[]>{
        try {
            const order = await this.orderModel.findById(orderId).populate<{managerId : User}>({
                path : "managerId"
            }).exec();
            if(!order){
                throw new NotFoundException(`Could not find order ${orderId}`);
            }
            const managerRank = order.managerId.location.rank;
            const productDetails = await Promise.all(
                order.productOrders.map(async (productOrder) => {
                    try{
                    const product = await this.productService.findProductById(productOrder.productId.toString());
                    const totalQuantity =await this.productService.getProductStock(productOrder.productId.toString());
                    const prices = await this.productService.getProductAveragePrice(productOrder.productId.toString());
                    const newQuantity = totalQuantity - productOrder.quantity;
                        return {
                            productName : product.name,
                            orderQuantity : productOrder.quantity,
                            averageUnitPurchasePrice :prices.averagePurchasePrice,
                            averageRankSellingPrice : (managerRank === LocationRank.Gold) 
                                ? prices.averageSellingPriceGold 
                                : (managerRank === LocationRank.Silver) 
                                    ? prices.averageSellingPriceSilver 
                                    : prices.averageSellingPriceBronze,
                            totalQuantity,
                            newQuantity : (newQuantity < 0) ? 0 : newQuantity,
                            productStatus : (newQuantity < 0)
                                ? ProductAvailability.NotAvailable
                                : (newQuantity <= product.stockLimit)
                                    ? ProductAvailability.BelowStockLimit
                                    : ProductAvailability.Available ,
                        } as ProductOrderProcessingDetails;
                    }catch(error){
                        this.logger.error(`Error Fetching Product ${productOrder.productId} : ${error.message}`);
                        throw new NotFoundException(`Failed to fetch productc ${productOrder.productId} : ${error.message}`)
                    }
                })
            );
            return productDetails;
        }catch(error){
            this.logger.error(`Error fetching order processing details: ${error.message}`);
            throw new BadRequestException(`Failed to fetch order processing details : ${error.message}`)
        }
    }
    async refuseOrder(orderId : string) : Promise<OrderInfo> {
        try{
            const order = await this.orderModel.findById(orderId);
            for(const productOrder of order.originalProductOrders){
                productOrder.quantity = 0;
            }
            order.updateOne({
                $set : { productOrders : []}
            })
            order.status = OrderStatus.Rejected;
            order.save();

            const populatedOrder = await order
            .populate<{managerId : UserInfo, productOrders : NamedProductOrder[]}>([
                {
                    path : "managerId",
                    select : "username phoneNumber location"
                },
                {
                    path : "productOrders",
                    select : "name",
                }
            ])

            return populatedOrder as OrderInfo;

        }catch(error){
            this.logger.error(`Error refusing order : ${error.message}`);
            throw new BadRequestException(`Failed to refuse order ${error.message}`);
        }
    }
    async validateOrder(orderId : string) : Promise<ValidatedOrderInfo> {
        try{
            const order = await this.orderModel
            .findById(orderId)
            .populate<{managerId : UserInfo}>({
                path : "managerId",
                select : "username phoneNumber location"
            })
            .populate<{ "productOrders.productId" : Product[]}>({
                path : "productOrders.productId",
                populate : {
                    path : "supplyBatchIds"
                }
            })
            .populate<{ "originalProductOrders.productId" : Product[]}>({
                path : "originalProductOrders.productId",
                populate : {
                    path : "supplyBatchIds"
                }
            })
            .exec();
            if(!order){
                throw new NotFoundException(`Failed to fetch order ${orderId}`);
            }
            if(order.status !== OrderStatus.Pending){
                throw new UnauthorizedException("Order must be pending to validate it");
            }
            const processingDetails = await this.getOrderProcessingDetails(orderId)
            if(!processingDetails.every((product) => {
                return product.productStatus !== ProductAvailability.NotAvailable
            })){
                this.logger.error("Called Validate Order with Unsufficient quantites for the product list");
                throw new PreconditionFailedException("All products must be available before validating an order");
            }
            order.totalPrice = 0;
            const res : ProductOrderBatchesInfo[] = [];
            for(const productOrder of order.productOrders){
                const productUsedBatches = await this.productService.retrieveNormalProductStock(productOrder.productId._id.toString(), productOrder.quantity, order.managerId.location.rank);
                productOrder.$set("productOrderInfo", productUsedBatches);
                productOrder.productOrderInfo.productPrice = productOrder.productOrderInfo.usedBatches.reduce((acc, batch) => {
                    return acc + (batch.quantityUsed * batch.sellingPrice);
                }, 0);
                productOrder.productOrderInfo.productUnitPrice = productOrder.productOrderInfo.productPrice / productOrder.quantity;
                res.push(productOrder.productOrderInfo);
                order.totalPrice += productOrder.productOrderInfo.productPrice;
            }
            order.status = OrderStatus.Validated;
            order.save();
            return {
                productsDetails : res,
                totalPrice : order.totalPrice
            }
        }catch(error){
            this.logger.error(`Error validating order: ${error.message}`);
            throw new BadRequestException(`Failed to validate order: ${error.message}`)
        }
    }
    async validateOrderWithAveragePrice(orderId : string) : Promise<ValidatedOrderInfo>{
        try{
            const order = await this.orderModel
            .findById(orderId)
            .populate<{managerId : UserInfo}>({
                path : "managerId",
                select : "username phoneNumber location"
            })
            .populate<{ "productOrders.productId" : Product[]}>({
                path : "productOrders.productId",
                populate : {
                    path : "supplyBatchIds"
                }
            })
            .exec();
            if(!order){
                throw new NotFoundException(`Failed to fetch order ${orderId}`);
            }
            if(order.status !== OrderStatus.Pending){
                throw new UnauthorizedException("Order must be pending to validate it");
            }
            const processingDetails = await this.getOrderProcessingDetails(orderId)
            if(!processingDetails.every((product) => {
                return product.productStatus !== ProductAvailability.NotAvailable
            })){
                this.logger.error("Called Validate Order with Unsufficient quantites for the product list");
                throw new PreconditionFailedException("All products must be available before validating an order");
            }
            order.totalPrice = 0;
            const res = [];
            for(const productOrder of order.productOrders){
                const productUsedBatches = await this.productService.retrieveNormalProductStock(productOrder.productId._id.toString(), productOrder.quantity, order.managerId.location.rank);
                productOrder.$set("productOrderInfo", productUsedBatches);
                const prices = await this.productService.getProductAveragePrice(productOrder.productId._id.toString());
                productOrder.productOrderInfo.productUnitPrice = (order.managerId.location.rank === LocationRank.Gold) 
                    ? prices.averageSellingPriceGold
                    : (order.managerId.location.rank === LocationRank.Silver)
                        ? prices.averageSellingPriceSilver
                        : prices.averageSellingPriceBronze;
                productOrder.productOrderInfo.productPrice = productOrder.productOrderInfo.productUnitPrice * productOrder.quantity;
                res.push( productOrder.productOrderInfo )
                order.totalPrice += productOrder.productOrderInfo.productPrice;
            }
            order.status = OrderStatus.Validated;
            order.save();
            return {
                productsDetails : res,
                totalPrice : order.totalPrice
            }
        }catch(error){
            this.logger.error(`Error validating order: ${error.message}`);
            throw new BadRequestException(`Failed to validate order: ${error.message}`)
        }
    }

    async changeProductOrderPrice(orderId : string, productId : string,productOrderPriceDTO : ProductOrderPriceDTO) {
        try{
            const order = await this.orderModel.findById(orderId);
            if(order.status !== OrderStatus.Validated){
                throw new UnauthorizedException("Order is either confirmed or has not been validated yet");
            }
            for( const productOrder of order.productOrders){
                if(productOrder.productId.toString() === productId){
                    if(!productOrderPriceDTO.productPrice && productOrderPriceDTO.productUnitPrice){
                        order.totalPrice -= productOrder.productOrderInfo.productUnitPrice * productOrder.quantity;
                        productOrder.productOrderInfo.productUnitPrice = productOrderPriceDTO.productUnitPrice;
                        productOrder.productOrderInfo.productPrice = productOrder.productOrderInfo.productUnitPrice * productOrder.quantity;
                        order.totalPrice += productOrder.productOrderInfo.productPrice;
                    }else if(!productOrderPriceDTO.productUnitPrice && productOrderPriceDTO.productPrice){
                        order.totalPrice -= productOrder.productOrderInfo.productPrice;
                        productOrder.productOrderInfo.productPrice = productOrderPriceDTO.productPrice
                        productOrder.productOrderInfo.productUnitPrice = productOrder.productOrderInfo.productPrice / productOrder.quantity;
                        order.totalPrice += productOrder.productOrderInfo.productPrice;
                    }else{
                       throw new BadRequestException("Changing Product Order Price must either contain unit price or total price") ;
                    }
                    order.save();
                    return {
                        productDetails : productOrder,
                        totalPrice : order.totalPrice
                    }
                }
            }
        }catch (error) {
            this.logger.error(`Error changing product order price: ${error.message}`);
            throw new BadRequestException(`Failed to change product order price: ${error.message}`)
        }
    }

    async confirmOrder(orderId : string) : Promise<OrderInfo>{
        try{
            const check = await this.findById(orderId);
            if(check.status !== OrderStatus.Validated){
                throw new UnauthorizedException("Order must be validated to be confirmed");
            }
            //TODO : chcek if a product order with the same id exists, if so we add the quantity only
            const order = await this.orderModel
            .findByIdAndUpdate(orderId, {
                $set : {status : OrderStatus.Confirmed}
            },
            {new : true, runValidators : true})
            .populate<{managerId : UserInfo}>({
                path : "managerId",
                select : "username phoneNumber location"
            })
            .populate<{ productOrders : NamedProductOrder[]}>({
                path : "productOrders.productId",
                select : "name",
            })
            .exec();
            return order as OrderInfo;
        }catch(error){
            this.logger.error(`Error confirming order : ${error.message}`);
            throw new BadRequestException(`Failed to confirm order : ${error.message}`)
        }
    }
}