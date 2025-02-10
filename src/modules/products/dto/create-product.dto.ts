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

  @IsOptional()
  @IsBoolean()
  isRawMaterial?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
