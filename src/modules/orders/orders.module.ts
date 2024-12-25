import {  Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { Order, OrderSchema} from "./orders.schema";
import { ProductsModule } from "../products/products.module";

@Module({
    imports : [
        MongooseModule.forFeature([
            { name : Order.name, schema : OrderSchema},
        ]),
        ProductsModule,
    ],
    controllers : [OrdersController],
    providers : [OrdersService],
    exports : [OrdersService]
})
export class OrderModule {};