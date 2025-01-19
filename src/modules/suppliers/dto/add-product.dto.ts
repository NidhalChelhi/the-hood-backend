import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddProductDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productNames: string[];
}