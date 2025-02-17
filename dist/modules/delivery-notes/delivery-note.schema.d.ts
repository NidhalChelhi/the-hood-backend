import { Document, Types } from "mongoose";
import { DeliveryNoteStatus } from "../../common/enums/delivery-note-status";
export declare class DeliveryNote extends Document {
    order: Types.ObjectId;
    status: DeliveryNoteStatus;
}
export declare const DeliveryNoteSchema: import("mongoose").Schema<DeliveryNote, import("mongoose").Model<DeliveryNote, any, any, any, Document<unknown, any, DeliveryNote> & DeliveryNote & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DeliveryNote, Document<unknown, {}, import("mongoose").FlatRecord<DeliveryNote>> & import("mongoose").FlatRecord<DeliveryNote> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
