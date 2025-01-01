import { PaginatedDataDTO } from "../../../common/dto/paginated-data.dtos";
import { User } from "../user.schema";
export declare class PaginatedUsers extends PaginatedDataDTO {
    users: User[];
}
