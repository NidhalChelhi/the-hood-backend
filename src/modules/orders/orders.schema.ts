import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
import { OrderStatus } from "../../common/enums/order-status.enum";


@Schema({timestamps : true, _id : false})
export class ProductOrder extends Document {
    @Prop({
        type : Types.ObjectId,
        ref : "Product",
        required : true,
    })
    productId : Types.ObjectId;

    @Prop({ required : true })
    quantity : number;

    @Prop({ required : true, enum: Object.values(OrderStatus), default : OrderStatus.Pending})
    status : OrderStatus;
}

@Schema({timestamps : true})
export class Order extends Document {
    @Prop({
        type : Types.ObjectId,
        ref : "User",
        required : true,
    })
    managerId : Types.ObjectId;

    @Prop({
        type : [ProductOrder],
        required : true,
    })
    productOrders : ProductOrder[];

    @Prop()
    totalPrice? : number;
}
//TODO : add validation to make sure every productOrder has a unique product ?
export const ProductOrderSchema = SchemaFactory.createForClass(ProductOrder);
export const OrderSchema = SchemaFactory.createForClass(Order);
