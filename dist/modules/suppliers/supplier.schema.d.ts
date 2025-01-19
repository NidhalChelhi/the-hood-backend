import { Document } from "mongoose";
export declare class Supplier extends Document {
    name: string;
    contact: string;
    address?: string;
    isActive: boolean;
    products: string[];
}
export declare const SupplierSchema: import("mongoose").Schema<Supplier, import("mongoose").Model<Supplier, any, any, any, Document<unknown, any, Supplier> & Supplier & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Supplier, Document<unknown, {}, import("mongoose").FlatRecord<Supplier>> & import("mongoose").FlatRecord<Supplier> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
