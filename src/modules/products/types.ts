import { Product, SupplyBatch } from "./product.schema";

export type PopulatedProduct = Omit<Product, "supplyBatchIds"> & {
  supplyBatchIds: SupplyBatch[];
};

export type NormalProductUsedBatch = {
    batchId : string,
    quantityUsed : number,
    purchasePrice : number,
    sellingPrice : number,
}
