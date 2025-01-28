import { PaginatedDataDTO } from "../../../common/dto/paginated-data.dtos";
import { Invoice } from "../invoice.schema";
export declare class PaginatedInvoices extends PaginatedDataDTO {
    invoices: Invoice[];
}
