import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "../enums/order-status.enum";

export class SearchQueryDTO {
    @IsString()
    @IsOptional()
    name : string;

    @IsOptional()
    @IsString()
    sort : "asc" | "dsc";

    @IsOptional()
    page : number;

    @IsOptional()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}