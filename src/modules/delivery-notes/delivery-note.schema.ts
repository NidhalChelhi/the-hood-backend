import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { DeliveryNoteStatus } from "../../common/enums/delivery-note-status";

@Schema({ timestamps: true })
export class DeliveryNote extends Document {
  @Prop({ type: Types.ObjectId, ref: "Order", required: true })
  order: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(DeliveryNoteStatus),
    default: DeliveryNoteStatus.PENDING,
  })
  status: DeliveryNoteStatus;
}

export const DeliveryNoteSchema = SchemaFactory.createForClass(DeliveryNote);
