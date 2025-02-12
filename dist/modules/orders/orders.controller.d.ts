import { OrdersService } from "./orders.service";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { UpdateOrderDTO } from "./dto/update-order.dto";
import { Order } from "./order.schema";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(createOrderDTO: CreateOrderDTO): Promise<import("mongoose").Document<unknown, {}, Order> & Order & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    processOrder(orderId: string, action: "decline" | "accept" | "modify", modifiedItems?: UpdateOrderDTO["orderItems"]): Promise<import("mongoose").Document<unknown, {}, Order> & Order & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(page?: number, limit?: number, search?: string, filter?: string): Promise<{
        data: Order[];
        total: number;
    }>;
    getOrder(orderId: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
