import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateProductOrderDTO {
    @IsNumber()
    @IsNotEmpty()
    quantity : number;
}
