import {
    IsMongoId,
    IsNumber,
    IsNotEmpty,
} from "class-validator"
export class CreateProductOrderDTO {
    @IsMongoId()
    @IsNotEmpty()
    productId : string;

    @IsNumber()
    @IsNotEmpty()
    quantity : number;
}
