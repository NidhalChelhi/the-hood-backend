import { PaginatedDataDTO } from "../../../common/dto/paginated-data.dtos";
import { PopulatedProduct } from "../types";
export declare class PaginatedProducts extends PaginatedDataDTO {
    products: PopulatedProduct[];
}
