import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Supplier extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  contact: string;

  @Prop()
  taxNumber : string;

  @Prop()
  address?: string;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  })
  purchasedProducts: { product: Types.ObjectId; quantity: number; price: number }[];
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
