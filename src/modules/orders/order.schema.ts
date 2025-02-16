import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { OrderStatus } from "../../common/enums/order-status.enum";

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  createdBy: Types.ObjectId;

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
  orderItems: { product: Types.ObjectId; quantity: number; price: number }[];

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: false,
  })
  originalOrderItems?: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({ type: Date, required: false })
  modifiedAt?: Date;

  @Prop({ type: Date, required: false })
  processedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
