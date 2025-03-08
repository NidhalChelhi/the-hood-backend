import { Types } from "mongoose";
declare class OrderItemDTO {
    product: Types.ObjectId;
    quantity: number;
    price: number;
}
export declare class CreateOrderDTO {
    createdBy: string;
    orderItems: OrderItemDTO[];
}
export {};
