import { PaginatedDataDTO } from "../../../common/dto/paginated-data.dtos";
import { OrderInfo } from "../types";


export class PaginatedOrders extends PaginatedDataDTO{
    orders : OrderInfo[];
}