import { OrderStatus } from "../enums/order-status.enum";
export declare class SearchQueryDTO {
    name: string;
    sort: "asc" | "dsc";
    page: number;
    status: OrderStatus;
}
