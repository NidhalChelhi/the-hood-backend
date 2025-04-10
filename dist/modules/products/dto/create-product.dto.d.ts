export declare class CreateProductDTO {
    name: string;
    description: string;
    unit: string;
    stockLimit: number;
    quantity: number;
    tva: number;
    purchasePrice: number;
    sellingPriceGold?: number;
    sellingPriceSilver?: number;
    sellingPriceBronze?: number;
    isRawMaterial?: boolean;
    isActive?: boolean;
}
