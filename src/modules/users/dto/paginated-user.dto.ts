import { PaginatedDataDTO } from "../../../common/dto/paginated-data.dtos";
import { User } from "../user.schema";


export class PaginatedUsers extends PaginatedDataDTO {
    users : User[];
}