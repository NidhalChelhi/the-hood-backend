import {
  IsString,
  IsOptional,
  IsEnum,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class LocationDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @IsEnum(["gold", "silver", "bronze"])
  rank?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  @IsEnum(["admin", "restaurant_manager"])
  role?: string;

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
