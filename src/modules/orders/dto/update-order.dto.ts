import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { Types } from "mongoose";

class UpdateOrderItemDTO {
  @IsNotEmpty()
  @Transform(() => Types.ObjectId)
  product: Types.ObjectId;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  price: number;
}

export class UpdateOrderDTO {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDTO)
  orderItems?: UpdateOrderItemDTO[];
}
