import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsArray} from "class-validator"
import { CreateProductOrderDTO } from "./create-product-order.dto";
export class CreateOrderDTO {
   @IsMongoId()
   @IsNotEmpty()
   managerId : string;

   @Type(() => CreateProductOrderDTO)
   @IsArray()
   productOrders : CreateProductOrderDTO[]
}
