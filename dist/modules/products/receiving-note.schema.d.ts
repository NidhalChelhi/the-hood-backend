import { Document, Types } from "mongoose";
export declare class ReceivingNote extends Document {
    product: Types.ObjectId;
    quantityAdded: number;
    purchasePrice: number;
    sellingPriceGold?: number;
    sellingPriceSilver?: number;
    sellingPriceBronze?: number;
    supplier: Types.ObjectId;
}
export declare const ReceivingNoteSchema: import("mongoose").Schema<ReceivingNote, import("mongoose").Model<ReceivingNote, any, any, any, Document<unknown, any, ReceivingNote> & ReceivingNote & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ReceivingNote, Document<unknown, {}, import("mongoose").FlatRecord<ReceivingNote>> & import("mongoose").FlatRecord<ReceivingNote> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
