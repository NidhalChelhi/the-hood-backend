import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { Product, ProductSchema } from "./product.schema";
import { ReceivingNote, ReceivingNoteSchema } from "./receiving-note.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ReceivingNote.name, schema: ReceivingNoteSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
