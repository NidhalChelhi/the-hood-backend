import { IsEnum, IsOptional } from "class-validator";
import { SearchQueryDTO } from "../../../common/dto/search-query.dto";

export class UserQueryDTO extends SearchQueryDTO {
    @IsOptional()
    @IsEnum(["gold", "silver", "bronze"])
    locationRank : string;

    @IsOptional()
    locationName : string;
}