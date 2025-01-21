import { Document, Types } from "mongoose";
export declare class Invoice extends Document {
    num: string;
    orders: Types.ObjectId[];
    invoiceDate: Date;
    paid: boolean;
    totalPrice: number;
}
export declare const InvoiceSchema: import("mongoose").Schema<Invoice, import("mongoose").Model<Invoice, any, any, any, Document<unknown, any, Invoice> & Invoice & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Invoice, Document<unknown, {}, import("mongoose").FlatRecord<Invoice>> & import("mongoose").FlatRecord<Invoice> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
