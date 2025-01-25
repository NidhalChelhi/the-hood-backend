import { Type } from "class-transformer";
import { IsArray } from "class-validator"
import { CreateProductOrderDTO } from "./create-product-order.dto";
export class CreateOrderDTO {
   @Type(() => CreateProductOrderDTO)
   @IsArray()
   originalProductOrders : CreateProductOrderDTO[]
}
