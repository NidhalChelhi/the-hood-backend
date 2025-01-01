import { IsOptional } from "class-validator";
import { SearchQueryDTO } from "../../../common/dto/search-query.dto";


export class ClientQueryDTO extends SearchQueryDTO{
    @IsOptional()
    pointSort: "asc" | "dsc";
}