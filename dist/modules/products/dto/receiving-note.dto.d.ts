export declare class ReceivingNoteDTO {
    productId: string;
    quantityAdded: number;
    purchasePrice: number;
    sellingPriceGold?: number;
    sellingPriceSilver?: number;
    sellingPriceBronze?: number;
    supplier: string;
}
export declare class ReceivingNoteMultipleDTO {
    items: {
        productId: string;
        quantityAdded: number;
        purchasePrice: number;
        sellingPriceGold?: number;
        sellingPriceSilver?: number;
        sellingPriceBronze?: number;
    }[];
    supplier: string;
}
