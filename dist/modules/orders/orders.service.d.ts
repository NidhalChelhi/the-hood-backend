import { Order } from "./orders.schema";
import { Model } from "mongoose";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { OrderInfo, ProductOrderProcessingDetails } from "./types";
import { CreateProductOrderDTO } from "./dto/create-product-order.dto";
import { UpdateProductOrderDTO } from "./dto/update-product-order.dto";
import { ProductsService } from "../products/products.service";
import { ProductOrderPriceDTO } from "./dto/product-order-price.dto";
import { UsersService } from "../users/users.service";
import { SearchQueryDTO } from "src/common/dto/search-query.dto";
export declare class OrdersService {
    private readonly orderModel;
    private readonly productService;
    private readonly userService;
    private readonly logger;
    constructor(orderModel: Model<Order>, productService: ProductsService, userService: UsersService);
    createOrder(createOrderDTO: CreateOrderDTO): Promise<Order>;
    findAllOrders(searchQuery?: SearchQueryDTO): Promise<{
        orders: OrderInfo[];
        pageNumber: number;
        totalElems: number;
        totalPages: number;
    }>;
    countDocs(options?: any): Promise<number>;
    findById(id: string): Promise<OrderInfo>;
    findOrdersForUser(userId: string, searchQuery?: SearchQueryDTO): Promise<{
        orders: OrderInfo[];
        pageNumber: number;
        totalElems: number;
        totalPages: number;
    }>;
    addProductOrder(orderId: string, createProductOrderDTO: CreateProductOrderDTO): Promise<OrderInfo>;
    updateProductOrder(orderId: string, productId: string, updateProductOrderDTO: UpdateProductOrderDTO): Promise<OrderInfo>;
    deleteOrder(orderId: string): Promise<Order>;
    deleteProductOrder(orderId: string, productId: string): Promise<OrderInfo>;
    getOrderProcessingDetails(orderId: string): Promise<ProductOrderProcessingDetails[]>;
    validateOrder(orderId: string): Promise<{
        productsDetail: any[];
        totalPrice: number;
    }>;
    validateOrderWithAveragePrice(orderId: string): Promise<{
        productsDetail: any[];
        totalPrice: number;
    }>;
    changeProductOrderPrice(orderId: string, productId: string, productOrderPriceDTO: ProductOrderPriceDTO): Promise<{
        productDetails: import("./orders.schema").ProductOrder;
        totalPrice: number;
    }>;
    confirmOrder(orderId: string): Promise<OrderInfo>;
}
