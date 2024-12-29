import { BadRequestException, Injectable, Logger, NotFoundException, PreconditionFailedException, UnauthorizedException} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order } from "./orders.schema";
import { Model } from "mongoose";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { NamedProductOrder, OrderInfo, ProductOrderProcessingDetails } from "./types";
import { UserInfo } from "../users/types";
import { CreateProductOrderDTO } from "./dto/create-product-order.dto";
import { OrderStatus } from "src/common/enums/order-status.enum";
import { UpdateProductOrderDTO } from "./dto/update-product-order.dto";
import { ProductsService } from "../products/products.service";
import { ProductAvailability } from "src/common/enums/product-availabilty.enum";
import { Product } from "../products/product.schema";
import { ProductOrderPriceDTO } from "./dto/product-order-price.dto";
import { LocationRank } from "src/common/enums/location-rank.enum";

@Injectable()
export class OrdersService{
    private readonly logger = new Logger(OrdersService.name);
    constructor(
        @InjectModel(Order.name) private readonly orderModel : Model<Order>,
        private readonly productService : ProductsService
    ){}

    async createOrder(createOrderDTO : CreateOrderDTO) : Promise<Order>{
        try {
            const order = new this.orderModel(createOrderDTO);
            return await order.save();
        }catch (error){
            this.logger.error("Error creating order : ", error.message);
            throw new BadRequestException(`Failed to create order : ${error.message}`)
        }
    }
    //TODO add pagination if needed
    async findAllOrders() : Promise<OrderInfo[]> {
        try{
            const orders = await this.orderModel
            .find()
            .populate<{managerId : UserInfo}>({
                path : "managerId",
                select : "username phoneNumber location"
            })
            .populate<{ productOrders : NamedProductOrder[]}>({
                path : "productOrders.productId",
                select : "name",
            })
            .exec();
            return orders as OrderInfo[];
        }catch (error){
            this.logger.error("Error fetching orders : ", error.message);
            throw new BadRequestException(`Failed to fetch orders : ${error.message}`)
        }
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
            return order as OrderInfo;
        }catch (error){
            this.logger.error(`Error fetching order : ${error.message}`);
            throw new BadRequestException(`Failed to fetch order : ${error.message}`)
        }
    }

    async findOrdersForUser(userId : string) : Promise<OrderInfo[]>{
        try{
            const orders = await this.orderModel
            .find({managerId : userId})
            .populate<{managerId : UserInfo}>({
                path : "managerId",
                select : "username phoneNumber location"
            })
            .populate<{ productOrders : NamedProductOrder[]}>({
                path : "productOrders.productId",
                select : "name",
            })
            .exec();
            if(!orders){
                throw new NotFoundException("User does not have any orders");
            }
            return orders as OrderInfo[];
        }catch (error){
            this.logger.error(`Error fetching orders for user ${userId} : ${error.message}`);
            throw new BadRequestException(`Failed to fetch orders for user ${userId} : ${error.message}`)
        }
    }

    async addProductOrder(orderId : string, createProductOrderDTO : CreateProductOrderDTO) : Promise<OrderInfo>{
        try{
            const order = await this.orderModel.findById(orderId);
            if(order.isConfirmed || order.isValidated){
                throw new UnauthorizedException("Cannot add product to validated / confirmed order");
            }
            const product = order.productOrders.find((productOrder) => {
                return productOrder.productId.toString() === createProductOrderDTO.productId;
            });
            if(!product){
                order.updateOne({
                    $push : {productOrders : {...createProductOrderDTO}}
                });
            }else{
               product.quantity += createProductOrderDTO.quantity; 
               product.status = OrderStatus.Pending;
            }
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
            this.logger.error(`Error adding product order : ${error.message}`);
            throw new BadRequestException(`Failed to create product order : ${error.message}`)
        }
    }

    async updateProductOrder(orderId : string, productId : string, updateProductOrderDTO : UpdateProductOrderDTO ): Promise<OrderInfo> {
        try{
            const check = await this.findById(orderId);
            if(check.isValidated || check.isConfirmed){
                throw new UnauthorizedException("Cannot modify Validated / Confirmed Order");
            }
            //Helper function to make sure that $set doesn't override all the fields
            const updateFields = Object.entries(updateProductOrderDTO).reduce(
                (acc, [key, value]) => {
                    if(value !== undefined){
                        acc[`productOrders.$.${key}`] = value;
                    }
                    return acc;
                },
                {} as Record<string, any>
            )
            const order = await this.orderModel
            .findByIdAndUpdate({_id : orderId, "productOrders.productId" : productId}, {
                    $set : updateFields,
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
            this.logger.error(`Error updating product order : ${error.message}`);
            throw new BadRequestException(`Failed to update product order : ${error.message}`)
        }
    }
    async deleteOrder(orderId : string) : Promise<Order>{
        try {
            const check = await this.findById(orderId);
            if(check.isValidated || check.isConfirmed){
                throw new UnauthorizedException("Cannot modify Validated / Confirmed Order");
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
    async deleteProductOrder(orderId : string, productId : string) : Promise<OrderInfo>{
        try{
            const check = await this.findById(orderId);
            if(check.isValidated || check.isConfirmed){
                throw new UnauthorizedException("Cannot modify Validated / Confirmed Order");
            }
            const order = await this.orderModel
            .findByIdAndUpdate(orderId, {
                $pull : { productOrders : {productId : productId} }
            })
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
            this.logger.error(`Error deleting product order : ${error.message}`);
            throw new BadRequestException(`Failed to delete product order : ${error.message}`)
        }
    }
    async getOrderProcessingDetails(orderId : string) : Promise<ProductOrderProcessingDetails[]>{
        try {
            const order = await this.orderModel.findById(orderId).exec();
            if(!order){
                throw new NotFoundException(`Could not find order ${orderId}`);
            }
            const productDetails = await Promise.all(
                order.productOrders.map(async (productOrder) => {
                    try{
                    const product = await this.productService.findProductById(productOrder.productId.toString());
                    const totalQuantity =await this.productService.getProductStock(productOrder.productId.toString());
                    const newQuantity = totalQuantity - productOrder.quantity;
                        return {
                            productName : product.name,
                            orderQuantity : productOrder.quantity,
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

    async validateOrder(orderId : string) {
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
            if(order.isConfirmed || order.isValidated){
                throw new UnauthorizedException("Order already confirmed / validated");
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
                productOrder.productOrderInfo.productPrice = productOrder.productOrderInfo.usedBatches.reduce((acc, batch) => {
                    return acc + (batch.quantityUsed * batch.sellingPrice);
                }, 0);
                productOrder.productOrderInfo.productUnitPrice = productOrder.productOrderInfo.productPrice / productOrder.quantity;
                productOrder.$set("status", OrderStatus.Accepted);
                res.push({
                    productOrderDetails : productOrder.productOrderInfo,
                    productStatus : productOrder.status,
                })
                order.totalPrice += productOrder.productOrderInfo.productPrice;
            }
            order.isValidated = true;
            order.save();
            return {
                productsDetail : res,
                totalPrice : order.totalPrice
            }
        }catch(error){
            this.logger.error(`Error validating order: ${error.message}`);
            throw new BadRequestException(`Failed to validate order: ${error.message}`)
        }
    }
    async validateOrderWithAveragePrice(orderId : string) {
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
            if(order.isConfirmed || order.isValidated){
                throw new UnauthorizedException("Order already confirmed / validated");
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
                productOrder.$set("status", OrderStatus.Accepted);
                res.push({
                    productOrderDetails : productOrder.productOrderInfo,
                    productStatus : productOrder.status,
                })
                order.totalPrice += productOrder.productOrderInfo.productPrice;
            }
            order.isValidated = true;
            order.save();
            return {
                productsDetail : res,
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
            if(order.isConfirmed){
                throw new UnauthorizedException("Cannot modify price for Confirmed Order");
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
            if(check.isConfirmed){
                throw new UnauthorizedException("Order already confirmed");
            }
            //TODO : chcek if a product order with the same id exists, if so we add the quantity only
            const order = await this.orderModel
            .findByIdAndUpdate(orderId, {
                $set : {isConfirmed : true}
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
