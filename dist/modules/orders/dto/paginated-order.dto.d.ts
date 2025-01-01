import { PaginatedDataDTO } from "../../../common/dto/paginated-data.dtos";
import { OrderInfo } from "../types";
export declare class PaginatedOrders extends PaginatedDataDTO {
    orders: OrderInfo[];
}
