import { BadRequestException, Injectable, Logger, NotFoundException} from "@nestjs/common";
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
            await this.findById(orderId);
            const order = await this.orderModel
            .findByIdAndUpdate(orderId, {
                $push : { productOrders : { ...createProductOrderDTO}}
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
            this.logger.error(`Error adding product order : ${error.message}`);
            throw new BadRequestException(`Failed to create product order : ${error.message}`)
        }
    }

    async updateProductOrder(orderId : string, productId : string, updateProductOrderDTO : UpdateProductOrderDTO ): Promise<OrderInfo> {
        try{
            await this.findById(orderId);
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
            await this.findById(orderId);
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
            const retrieveInfo = await Promise.all(
                order.productOrders.map(async (productOrder) => {
                    try{
                        const { productName, usedBatches } = await this.productService.retrieveNormalProductStock(productOrder.productId._id.toString(), productOrder.quantity, order.managerId.location.rank);
                        return {
                            productName,
                            usedBatches,
                            quantity : productOrder.quantity,
                            status : OrderStatus.Accepted,
                        }
                    }catch(error){
                        this.logger.error(`Error retrieving stock for product ${productOrder.productId} and quantity ${productOrder.quantity} : ${error.message}`);
                        throw new BadRequestException(`Failed to retrieve stock : ${error.message}`);
                    }
                })
            );
            order.productOrders.forEach((product) => {
                product.status = OrderStatus.Accepted;
            })
            if(!order.totalPrice){
                order.totalPrice = 0;
            }
            retrieveInfo.forEach((product) => {
                product.usedBatches.forEach((batch) => {
                    order.totalPrice += batch.quantityUsed * batch.sellingPrice;
                })
            })
            await order.save();
            return {
                ...retrieveInfo,
                totalPrice : order.totalPrice
            }
        }catch(error){
            this.logger.error(`Error validating order: ${error.message}`);
            throw new BadRequestException(`Failed to validate order: ${error.message}`)
        }
    }
}
