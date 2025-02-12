import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class UpdateOrderItemDTO {
  @IsNotEmpty()
  product: string;

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
