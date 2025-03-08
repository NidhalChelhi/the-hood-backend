import { IsArray, IsEmpty, IsNotEmpty, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Types } from "mongoose";

class OrderItemDTO {
  @IsNotEmpty()
  @Transform(() => Types.ObjectId)
  product: Types.ObjectId;

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
