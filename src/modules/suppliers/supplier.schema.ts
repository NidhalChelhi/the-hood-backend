import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Supplier extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  contact: string;

  @Prop()
  address?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
