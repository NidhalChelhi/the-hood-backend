import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class ReceivingNote extends Document {
  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  quantityAdded: number;

  @Prop({ required: true })
  purchasePrice: number;

  @Prop()
  sellingPriceGold?: number;

  @Prop()
  sellingPriceSilver?: number;

  @Prop()
  sellingPriceBronze?: number;

  @Prop({ type: Types.ObjectId, ref: "Supplier" })
  supplier: Types.ObjectId;
}

export const ReceivingNoteSchema = SchemaFactory.createForClass(ReceivingNote);
