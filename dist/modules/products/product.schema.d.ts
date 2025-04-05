import { Document, Types } from "mongoose";
export declare class Product extends Document {
    name: string;
    description: string;
    unit: string;
    stockLimit: number;
    supplier?: Types.ObjectId;
    quantity: number;
    tva: number;
    purchasePrice: number;
    sellingPriceGold?: number;
    sellingPriceSilver?: number;
    sellingPriceBronze?: number;
    isBelowStockLimit: boolean;
    isRawMaterial: boolean;
    isActive: boolean;
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
