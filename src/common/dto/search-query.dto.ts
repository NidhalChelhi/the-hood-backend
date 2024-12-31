import { IsOptional, IsString } from "class-validator";

export class SearcQueryDTO {
    @IsString()
    @IsOptional()
    name : string;

    @IsOptional()
    @IsString()
    sort : "asc" | "dsc";

    @IsOptional()
    page : number;
}