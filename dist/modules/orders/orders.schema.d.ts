import { Document, Types } from "mongoose";
import { OrderStatus } from "../../common/enums/order-status.enum";
import { NormalProductUsedBatch } from "../products/types";
export declare class NormalProductUsedBatchClass extends Document {
    batchId: string;
    quantityUsed: number;
    purchasePrice: number;
    sellingPrice: number;
}
export declare const NormalProductUsedBatchSchema: import("mongoose").Schema<NormalProductUsedBatchClass, import("mongoose").Model<NormalProductUsedBatchClass, any, any, any, Document<unknown, any, NormalProductUsedBatchClass> & NormalProductUsedBatchClass & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NormalProductUsedBatchClass, Document<unknown, {}, import("mongoose").FlatRecord<NormalProductUsedBatchClass>> & import("mongoose").FlatRecord<NormalProductUsedBatchClass> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare class ProductOrderBatchesInfo extends Document {
    productName: string;
    usedBatches: NormalProductUsedBatch[];
    productPrice: number;
    productUnitPrice: number;
}
export declare const ProductOrderBatchesInfoSchema: import("mongoose").Schema<ProductOrderBatchesInfo, import("mongoose").Model<ProductOrderBatchesInfo, any, any, any, Document<unknown, any, ProductOrderBatchesInfo> & ProductOrderBatchesInfo & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductOrderBatchesInfo, Document<unknown, {}, import("mongoose").FlatRecord<ProductOrderBatchesInfo>> & import("mongoose").FlatRecord<ProductOrderBatchesInfo> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare class ProductOrder extends Document {
    productId: Types.ObjectId;
    quantity: number;
    productOrderInfo: ProductOrderBatchesInfo;
}
export declare class Order extends Document {
    managerId: Types.ObjectId;
    productOrders: ProductOrder[];
    originalProductOrders: ProductOrder[];
    totalPrice?: number;
    status: OrderStatus;
}
export declare const ProductOrderSchema: import("mongoose").Schema<ProductOrder, import("mongoose").Model<ProductOrder, any, any, any, Document<unknown, any, ProductOrder> & ProductOrder & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductOrder, Document<unknown, {}, import("mongoose").FlatRecord<ProductOrder>> & import("mongoose").FlatRecord<ProductOrder> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
