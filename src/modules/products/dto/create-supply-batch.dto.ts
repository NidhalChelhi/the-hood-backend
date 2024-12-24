import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from "class-validator";

export class CreateSupplyBatchDTO {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  purchasePrice: number;

  @IsNumber()
  @IsOptional()
  sellingPriceGold?: number;

  @IsNumber()
  @IsOptional()
  sellingPriceSilver?: number;

  @IsNumber()
  @IsOptional()
  sellingPriceBronze?: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsMongoId()
  @IsOptional()
  supplierId?: string;

  @IsBoolean()
  @IsOptional()
  isFromRawMaterial?: boolean;
}
