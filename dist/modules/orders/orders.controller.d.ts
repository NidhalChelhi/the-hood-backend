import { OrdersService } from "./orders.service";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { CreateProductOrderDTO } from "./dto/create-product-order.dto";
import { UpdateProductOrderDTO } from "./dto/update-product-order.dto";
import { ProductOrderPriceDTO } from "./dto/product-order-price.dto";
import { ProductQueryDTO } from "./dto/product-query.dto";
import { SearchQueryDTO } from "../../common/dto/search-query.dto";
export declare class OrdersController {
    private readonly orderService;
    constructor(orderService: OrdersService);
    create(createOrderDTO: CreateOrderDTO): Promise<import("./orders.schema").Order>;
    findAll(queryParams: SearchQueryDTO): Promise<{
        orders: import("./types").OrderInfo[];
        pageNumber: number;
        totalElems: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<import("./types").OrderInfo>;
    findAllForUser(req: any, queryParams: SearchQueryDTO): Promise<{
        orders: import("./types").OrderInfo[];
        pageNumber: number;
        totalElems: number;
        totalPages: number;
    }>;
    addProductOrder(id: string, createProductOrderDTO: CreateProductOrderDTO): Promise<import("./types").OrderInfo>;
    updateProductOrder(id: string, product: ProductQueryDTO, updateProductOrderDTO: UpdateProductOrderDTO): Promise<import("./types").OrderInfo>;
    deleteProductOrder(id: string, product: ProductQueryDTO): Promise<import("./types").OrderInfo>;
    deleteOrder(id: string): Promise<import("./orders.schema").Order>;
    getProcessingDetails(id: string): Promise<import("./types").ProductOrderProcessingDetails[]>;
    validateOrder(id: string): Promise<{
        productsDetail: any[];
        totalPrice: number;
    }>;
    validateOrderAveragePrice(id: string): Promise<{
        productsDetail: any[];
        totalPrice: number;
    }>;
    changeProductOrderPrice(id: string, product: ProductQueryDTO, productOrderPriceDTO: ProductOrderPriceDTO): Promise<{
        productDetails: import("./orders.schema").ProductOrder;
        totalPrice: number;
    }>;
    confirmOrder(id: string): Promise<import("./types").OrderInfo>;
}
