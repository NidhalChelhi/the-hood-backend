import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
class RawMaterialUsageDTO {
  @IsNotEmpty()
  @IsString()
  rawMaterialId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantityUsed: number;
}
export class ConvertRawMaterialsDTO {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RawMaterialUsageDTO)
  rawMaterials: RawMaterialUsageDTO[];

  @IsNotEmpty()
  @IsString()
  finishedProductId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantityProduced: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sellingPriceGold?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sellingPriceSilver?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sellingPriceBronze?: number;
}
