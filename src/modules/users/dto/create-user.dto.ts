import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class LocationDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(["gold", "silver", "bronze"])
  rank: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(["admin", "restaurant_manager"])
  role: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ValidateIf((obj) => obj.role === "restaurant_manager")
  @ValidateNested()
  @Type(() => LocationDTO)
  location?: LocationDTO;
}
