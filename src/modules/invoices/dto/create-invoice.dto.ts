import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  num: string;

  @IsArray()
  @IsNotEmpty()
  orders: string[]; 

  @IsBoolean()
  paid?: boolean; 
}