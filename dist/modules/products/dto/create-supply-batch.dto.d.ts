export declare class CreateSupplyBatchDTO {
    productId: string;
    purchasePrice: number;
    sellingPriceGold?: number;
    sellingPriceSilver?: number;
    sellingPriceBronze?: number;
    quantity: number;
    supplierId?: string;
    isFromRawMaterial?: boolean;
}
