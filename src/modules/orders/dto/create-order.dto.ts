import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class OrderItemDTO {
  @IsNotEmpty()
  product: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  price: number;
}

export class CreateOrderDTO {
  @IsNotEmpty()
  createdBy: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  orderItems: OrderItemDTO[];
}
