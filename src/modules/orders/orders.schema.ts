import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
import { OrderStatus } from "../../common/enums/order-status.enum";
import { NormalProductUsedBatch } from "../products/types";

@Schema({_id : false})
export class NormalProductUsedBatchClass extends Document {

    @Prop({required : true})
    batchId : string;

    @Prop({required : true})
    quantityUsed : number;

    @Prop({required : true})
    purchasePrice : number;

    @Prop({required : true})
    sellingPrice : number;
}
export const NormalProductUsedBatchSchema = SchemaFactory.createForClass(NormalProductUsedBatchClass);

@Schema({_id : false})
export class ProductOrderBatchesInfo extends Document {
    @Prop({required : true})
    productName : string;

    @Prop({
        type: [NormalProductUsedBatchClass],
        required : true,
        default : []
    })
    usedBatches : NormalProductUsedBatch[];

    @Prop({ default : 0})
    productPrice : number;

    @Prop({
        default : 0
    })
    productUnitPrice : number;
}

export const ProductOrderBatchesInfoSchema = SchemaFactory.createForClass(ProductOrderBatchesInfo);

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

    @Prop({
        type : ProductOrderBatchesInfo,
        required : false,
    })
    productOrderInfo : ProductOrderBatchesInfo;

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
    })
    productOrders : ProductOrder[];
    
    @Prop({
        type : [ProductOrder],
        required : true,
    })
    originalProductOrders : ProductOrder[];

    @Prop()
    totalPrice? : number;

    @Prop({ enum : Object.values(OrderStatus), default : OrderStatus.Pending})
    status : OrderStatus;

}
//TODO : add validation to make sure every productOrder has a unique product ?
export const ProductOrderSchema = SchemaFactory.createForClass(ProductOrder);
export const OrderSchema = SchemaFactory.createForClass(Order);
