import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./order.schema";
import { ProductsModule } from "../products/products.module";
import { DeliveryNotesModule } from "../delivery-notes/delivery-notes.module";
import { UsersModule } from "../users/users.module";
import { User, UserSchema } from "../users/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ProductsModule,
    DeliveryNotesModule,
    UsersModule,
  ],
  controllers: [OrdersController],

  providers: [OrdersService],

  exports: [OrdersService],
})
export class OrdersModule {}
