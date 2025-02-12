import { Module } from "@nestjs/common";
import { DeliveryNotesService } from "./delivery-notes.service";
import { DeliveryNotesController } from "./delivery-notes.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { DeliveryNote, DeliveryNoteSchema } from "./delivery-note.schema";
import { User, UserSchema } from "../users/user.schema";
import { Order, OrderSchema } from "../orders/order.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliveryNote.name, schema: DeliveryNoteSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [DeliveryNotesController],
  providers: [DeliveryNotesService],
  exports: [DeliveryNotesService, MongooseModule],
})
export class DeliveryNotesModule {}
