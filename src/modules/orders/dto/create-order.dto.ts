import { IsArray, IsEmpty, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class OrderItemDTO {
  @IsNotEmpty()
  product: string;

  @IsNotEmpty()
  quantity: number;

  @IsEmpty()
  price: number;
}

export class CreateOrderDTO {
  @IsEmpty()
  createdBy: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  orderItems: OrderItemDTO[];
}
