declare class RawMaterialUsageDTO {
    rawMaterialId: string;
    quantityUsed: number;
}
export declare class ConvertRawMaterialsDTO {
    rawMaterials: RawMaterialUsageDTO[];
    finishedProductId: string;
    quantityProduced: number;
    sellingPriceGold?: number;
    sellingPriceSilver?: number;
    sellingPriceBronze?: number;
}
export {};
