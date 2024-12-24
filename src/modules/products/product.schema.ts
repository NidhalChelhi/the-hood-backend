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

  @Prop({
    type: [{ type: Types.ObjectId, ref: "SupplyBatch" }],
    default: [],
  })
  supplyBatchIds: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  stockLimit: number;

  @Prop({ default: false })
  isBelowStockLimit: boolean;

  @Prop({ default: false })
  isRawMaterial: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

@Schema({ timestamps: true })
export class SupplyBatch extends Document {
  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  purchasePrice: number;

  @Prop()
  sellingPriceGold?: number;

  @Prop()
  sellingPriceSilver?: number;

  @Prop()
  sellingPriceBronze?: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: "Supplier" })
  supplierId?: Types.ObjectId;

  @Prop({ default: false })
  isFromRawMaterial: boolean;
}

export const SupplyBatchSchema = SchemaFactory.createForClass(SupplyBatch);
