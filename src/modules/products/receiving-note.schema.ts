import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class ReceivingNote extends Document {
  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: "Product", required: true },
        quantityAdded: { type: Number, required: true },
        purchasePrice: { type: Number, required: true },
        sellingPriceGold: { type: Number },
        sellingPriceSilver: { type: Number },
        sellingPriceBronze: { type: Number },
      },
    ],
    required: true,
  })
  items: {
    product: Types.ObjectId;
    quantityAdded: number;
    purchasePrice: number;
    sellingPriceGold?: number;
    sellingPriceSilver?: number;
    sellingPriceBronze?: number;
  }[];

  @Prop({ type: Types.ObjectId, ref: "Supplier" })
  supplier: Types.ObjectId;
}

export const ReceivingNoteSchema = SchemaFactory.createForClass(ReceivingNote);
