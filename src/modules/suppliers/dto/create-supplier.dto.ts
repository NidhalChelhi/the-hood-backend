import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from "class-validator";
  
  export class CreateSupplierDTO {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    contact: string;
  
    @IsString()
    @IsOptional()
    address?: string;
  
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    products: string[];
  }