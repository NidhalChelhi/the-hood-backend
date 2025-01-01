import { PaginatedDataDTO } from "../../../common/dto/paginated-data.dtos";
import { Client } from "../clients.schema";
export declare class PaginatedClients extends PaginatedDataDTO {
    clients: Client[];
}
