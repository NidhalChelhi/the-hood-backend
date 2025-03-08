export declare class CreateProductDTO {
    name: string;
    description: string;
    unit: string;
    stockLimit: number;
    quantity: number;
    purchasePrice: number;
    sellingPriceGold?: number;
    sellingPriceSilver?: number;
    sellingPriceBronze?: number;
    isRawMaterial?: boolean;
    isActive?: boolean;
}
