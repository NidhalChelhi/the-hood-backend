import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ReceivingNoteDTO {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantityAdded: number;

  @IsNotEmpty()
  @IsNumber()
  purchasePrice: number;

  @IsOptional()
  @IsNumber()
  sellingPriceGold?: number;

  @IsOptional()
  @IsNumber()
  sellingPriceSilver?: number;

  @IsOptional()
  @IsNumber()
  sellingPriceBronze?: number;

  @IsNotEmpty()
  @IsString()
  supplier: string;
}

export class ReceivingNoteMultipleDTO {
  items: {
    productId: string;
    quantityAdded: number;
    purchasePrice: number;
    sellingPriceGold?: number;
    sellingPriceSilver?: number;
    sellingPriceBronze?: number;
  }[];
  supplier: string;
}
