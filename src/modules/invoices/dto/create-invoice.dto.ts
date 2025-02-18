import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateInvoiceDTO {
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  createdFor : string;

  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  orders : string[];

}