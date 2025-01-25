import { Order } from "./orders.schema";
import { Model, RootFilterQuery } from "mongoose";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { OrderDetails, OrderInfo, OriginalOrderInfo, ValidatedOrderInfo } from "./types";
import { CreateProductOrderDTO } from "./dto/create-product-order.dto";
import { ProductsService } from "../products/products.service";
import { ProductOrderPriceDTO } from "./dto/product-order-price.dto";
import { UsersService } from "../users/users.service";
import { SearchQueryDTO } from "../../common/dto/search-query.dto";
import { PaginatedOrders } from "./dto/paginated-order.dto";
export declare class OrdersService {
    private readonly orderModel;
    private readonly productService;
    private readonly userService;
    private readonly logger;
    constructor(orderModel: Model<Order>, productService: ProductsService, userService: UsersService);
    createOrder(createOrderDTO: CreateOrderDTO, managerId: string): Promise<OriginalOrderInfo>;
    findAllOrders(searchQuery?: SearchQueryDTO): Promise<PaginatedOrders>;
    countDocs(options?: RootFilterQuery<Order>): Promise<number>;
    findById(id: string): Promise<OrderInfo>;
    findOrdersForUser(userId: string, searchQuery?: SearchQueryDTO): Promise<{
        orders: OriginalOrderInfo[];
        pageNumber: number;
        totalElems: number;
        totalPages: number;
    }>;
    addProductOrder(orderId: string, createProductOrderDTO: CreateProductOrderDTO): Promise<OriginalOrderInfo>;
    updateProductOrder(orderId: string, productId: string, quantity: number): Promise<OrderInfo>;
    deleteOrder(orderId: string): Promise<Omit<Order, "originalProductOrders" | "status" | "totalPrice">>;
    deleteProductOrder(orderId: string, productId: string): Promise<OriginalOrderInfo>;
    getOrderProcessingDetails(orderId: string): Promise<OrderDetails>;
    refuseOrder(orderId: string): Promise<OrderInfo>;
    validateOrder(orderId: string): Promise<ValidatedOrderInfo>;
    validateOrderWithAveragePrice(orderId: string): Promise<ValidatedOrderInfo>;
    changeProductOrderPrice(orderId: string, productId: string, productOrderPriceDTO: ProductOrderPriceDTO): Promise<{
        productDetails: import("./orders.schema").ProductOrder;
        totalPrice: number;
    }>;
    confirmOrder(orderId: string): Promise<OrderInfo>;
}
