import { OrderStatus } from "src/common/enums/order-status.enum";
export declare class CreateProductOrderDTO {
    productId: string;
    quantity: number;
    status: OrderStatus;
}
