import { Product, SupplyBatch } from "./product.schema";

export type PopulatedProduct = Omit<Product, "supplyBatchIds"> & {
  supplyBatchIds: SupplyBatch[];
};
