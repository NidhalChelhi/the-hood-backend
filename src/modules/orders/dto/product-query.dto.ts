import { IsNotEmpty, IsString } from "class-validator";

export class ProductQueryDTO {
    @IsString()
    @IsNotEmpty()
    productId : string;
}