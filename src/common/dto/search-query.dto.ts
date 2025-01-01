import { IsOptional, IsString } from "class-validator";

export class SearchQueryDTO {
    @IsString()
    @IsOptional()
    name : string;

    @IsOptional()
    @IsString()
    sort : "asc" | "dsc";

    @IsOptional()
    page : number;
}