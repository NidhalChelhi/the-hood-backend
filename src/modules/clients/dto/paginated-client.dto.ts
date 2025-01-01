import { PaginatedDataDTO } from "../../../common/dto/paginated-data.dtos";
import { Client } from "../clients.schema";


export class PaginatedClients extends PaginatedDataDTO {
    clients : Client[];
}