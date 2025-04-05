import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  stockLimit: number;

  @Prop({ type: Types.ObjectId, ref: "Supplier" })
  supplier?: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  quantity: number;

  @Prop({ required: true, default: 0 })
  tva: number;

  @Prop({
    default: 0,
    set: (value: number) => parseFloat(value.toFixed(3)),
  })
  purchasePrice: number;

  @Prop({
    set: (value: number) => parseFloat(value.toFixed(3)),
  })
  sellingPriceGold?: number;

  @Prop({
    set: (value: number) => parseFloat(value.toFixed(3)),
  })
  sellingPriceSilver?: number;

  @Prop({
    set: (value: number) => parseFloat(value.toFixed(3)),
  })
  sellingPriceBronze?: number;

  @Prop({ default: false })
  isBelowStockLimit: boolean;

  @Prop({ default: false })
  isRawMaterial: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
