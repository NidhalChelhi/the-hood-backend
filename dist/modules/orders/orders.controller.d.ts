import { OrdersService } from "./orders.service";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { CreateProductOrderDTO } from "./dto/create-product-order.dto";
import { UpdateProductOrderDTO } from "./dto/update-product-order.dto";
import { ProductOrderPriceDTO } from "./dto/product-order-price.dto";
import { ProductQueryDTO } from "./dto/product-query.dto";
import { SearchQueryDTO } from "../../common/dto/search-query.dto";
import { Request } from "express";
export declare class OrdersController {
    private readonly orderService;
    constructor(orderService: OrdersService);
    create(req: Request, createOrderDTO: CreateOrderDTO): Promise<import("./types").OriginalOrderInfo>;
    findAll(queryParams: SearchQueryDTO): Promise<import("./dto/paginated-order.dto").PaginatedOrders>;
    findById(id: string): Promise<import("./types").OrderInfo>;
    findAllForUser(req: any, queryParams: SearchQueryDTO): Promise<{
        orders: import("./types").OriginalOrderInfo[];
        pageNumber: number;
        totalElems: number;
        totalPages: number;
    }>;
    addProductOrder(id: string, createProductOrderDTO: CreateProductOrderDTO): Promise<import("./types").OriginalOrderInfo>;
    updateProductOrder(id: string, product: ProductQueryDTO, updateProductOrderDTO: UpdateProductOrderDTO): Promise<import("./types").OrderInfo>;
    deleteProductOrder(id: string, product: ProductQueryDTO): Promise<import("./types").OriginalOrderInfo>;
    deleteOrder(id: string): Promise<Omit<import("./orders.schema").Order, "totalPrice" | "originalProductOrders" | "status">>;
    getProcessingDetails(id: string): Promise<import("./types").OrderDetails>;
    validateOrder(id: string): Promise<import("./types").ValidatedOrderInfo>;
    validateOrderAveragePrice(id: string): Promise<import("./types").ValidatedOrderInfo>;
    changeProductOrderPrice(id: string, product: ProductQueryDTO, productOrderPriceDTO: ProductOrderPriceDTO): Promise<{
        productDetails: import("./orders.schema").ProductOrder;
        totalPrice: number;
    }>;
    confirmOrder(id: string): Promise<import("./types").OrderInfo>;
}
