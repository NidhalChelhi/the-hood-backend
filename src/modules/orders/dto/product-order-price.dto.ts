import { IsNumber, IsOptional } from "class-validator"

export class ProductOrderPriceDTO {
    @IsNumber()
    @IsOptional()
    productPrice? : number;

    @IsNumber()
    @IsOptional()
    productUnitPrice? : number;
}
