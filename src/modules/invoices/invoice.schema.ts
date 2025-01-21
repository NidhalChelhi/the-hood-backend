import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ required: true, unique: true })
  num: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Order' }], 
    required: true,
  })
  orders: Types.ObjectId[];

  @Prop({ default: Date.now })
  invoiceDate: Date;

  @Prop({ default: false })
  paid: boolean;

  @Prop({ default: 0 })
  totalPrice: number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);