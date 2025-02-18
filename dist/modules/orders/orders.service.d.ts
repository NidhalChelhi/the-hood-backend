import { Model } from "mongoose";
import { Order } from "./order.schema";
import { ProductsService } from "../products/products.service";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { UpdateOrderDTO } from "./dto/update-order.dto";
import { DeliveryNotesService } from "../delivery-notes/delivery-notes.service";
import { UsersService } from "../users/users.service";
import { User } from "../users/user.schema";
export declare class OrdersService {
    private readonly orderModel;
    private readonly userModel;
    private readonly deliveryNoteService;
    private readonly productsService;
    private readonly usersService;
    constructor(orderModel: Model<Order>, userModel: Model<User>, deliveryNoteService: DeliveryNotesService, productsService: ProductsService, usersService: UsersService);
    findAll(page?: number, limit?: number, search?: string, filter?: string): Promise<{
        data: Order[];
        total: number;
    }>;
    findOne(orderId: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findMultiple(orderIds: string[]): Promise<(import("mongoose").Document<unknown, {}, Order> & Order & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
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
}
