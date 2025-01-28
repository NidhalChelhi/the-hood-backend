import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateClientDto {
    
    @IsString()
    @IsNotEmpty()
    firstName : string;
    
    @IsString()
    @IsNotEmpty()
    lastName : string;
    
    @IsString()
    @IsOptional()
    email?: string;
 
    @IsString()
    @IsNotEmpty()
    phoneNumber : string;

    @IsString()
    @IsNotEmpty()
    barCode : string;
}
