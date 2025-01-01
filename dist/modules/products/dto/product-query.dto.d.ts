import { SearchQueryDTO } from "../../../common/dto/search-query.dto";
export declare class ProductQueryDTO extends SearchQueryDTO {
    unit: string;
    raw: string;
    belowStockLimit: "true";
    active: "true";
    sortStockLimit: "asc" | "dsc";
}
