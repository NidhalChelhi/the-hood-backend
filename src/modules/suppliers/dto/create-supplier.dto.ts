import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSupplierDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @IsNotEmpty()
  taxNumber : number;

  @IsString()
  @IsOptional()
  address?: string;
}
