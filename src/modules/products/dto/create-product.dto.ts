import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from "class-validator";

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  stockLimit: number;

  @IsNotEmpty()
  @IsNumber()
  quantity : number;

  @IsNotEmpty()
  @IsNumber()
  tva : number;

  @IsNotEmpty()
  @IsNumber()
  purchasePrice : number;

  @IsOptional()
  @IsNumber()
  sellingPriceGold?: number;

  @IsOptional()
  @IsNumber()
  sellingPriceSilver?: number;

  @IsOptional()
  @IsNumber()
  sellingPriceBronze?: number;

  @IsOptional()
  @IsBoolean()
  isRawMaterial?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
