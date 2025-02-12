declare class UpdateOrderItemDTO {
    product: string;
    quantity: number;
    price: number;
}
export declare class UpdateOrderDTO {
    orderItems?: UpdateOrderItemDTO[];
}
export {};
