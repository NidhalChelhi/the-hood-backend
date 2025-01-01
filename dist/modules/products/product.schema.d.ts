import { Document, Types } from "mongoose";
export declare class Product extends Document {
    name: string;
    description: string;
    unit: string;
    supplyBatchIds: Types.ObjectId[];
    isActive: boolean;
    stockLimit: number;
    isBelowStockLimit: boolean;
    isRawMaterial: boolean;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product> & Product & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>> & import("mongoose").FlatRecord<Product> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare class SupplyBatch extends Document {
    productId: Types.ObjectId;
    purchasePrice: number;
    sellingPriceGold?: number;
    sellingPriceSilver?: number;
    sellingPriceBronze?: number;
    quantity: number;
    supplierId?: Types.ObjectId;
    isFromRawMaterial: boolean;
}
export declare const SupplyBatchSchema: import("mongoose").Schema<SupplyBatch, import("mongoose").Model<SupplyBatch, any, any, any, Document<unknown, any, SupplyBatch> & SupplyBatch & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SupplyBatch, Document<unknown, {}, import("mongoose").FlatRecord<SupplyBatch>> & import("mongoose").FlatRecord<SupplyBatch> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
