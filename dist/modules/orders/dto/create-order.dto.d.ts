declare class OrderItemDTO {
    product: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDTO {
    createdBy: string;
    orderItems: OrderItemDTO[];
}
export {};
