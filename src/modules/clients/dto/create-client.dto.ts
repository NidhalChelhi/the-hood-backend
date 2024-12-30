import { IsNotEmpty, IsString } from "class-validator";

export class CreateClientDto {
    
    @IsString()
    @IsNotEmpty()
    firstName : string;
    
    @IsString()
    @IsNotEmpty()
    lastName : string;
    
    @IsString()
    @IsNotEmpty()
    email : string;
    
    @IsString()
    @IsNotEmpty()
    barCode : string;
}
