import { Types } from "mongoose";
declare class UpdateOrderItemDTO {
    product: Types.ObjectId;
    quantity: number;
    price: number;
}
export declare class UpdateOrderDTO {
    orderItems?: UpdateOrderItemDTO[];
}
export {};
