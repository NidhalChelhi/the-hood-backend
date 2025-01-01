import { IsEnum, IsOptional } from "class-validator";
import { SearchQueryDTO } from "../../../common/dto/search-query.dto";

export class ProductQueryDTO extends SearchQueryDTO{
    @IsOptional()
    unit : string;

    @IsOptional()
    @IsEnum(["raw", "notRaw"])
    raw : string;

    @IsOptional()
    belowStockLimit : "true";

    @IsOptional()
    active : "true";

    @IsOptional()
    sortStockLimit : "asc" | "dsc";
}