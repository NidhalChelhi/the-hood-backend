import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({timestamps : true})
export class Invoice extends Document{
  @Prop({required : true, type : Types.ObjectId, ref : "User"})
  createdFor : Types.ObjectId;

  @Prop({required : true, type : [Types.ObjectId], ref : "Order" })
  orders : Types.ObjectId[];

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
  items: { product: Types.ObjectId; quantity: number; price: number }[];

  @Prop({required : true, default : 0})
  totalPrice : number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);