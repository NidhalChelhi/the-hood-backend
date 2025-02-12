import { Document, Types } from "mongoose";
import { OrderStatus } from "src/common/enums/order-status.enum";
export declare class Order extends Document {
    createdBy: Types.ObjectId;
    orderItems: {
        product: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    originalOrderItems?: {
        product: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    status: OrderStatus;
    modifiedAt?: Date;
    processedAt?: Date;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
