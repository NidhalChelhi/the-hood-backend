import { Model } from "mongoose";
import { Product, SupplyBatch } from "./product.schema";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { CreateSupplyBatchDTO } from "./dto/create-supply-batch.dto";
import { NormalProductUsedBatch, PopulatedProduct } from "./types";
import { LocationRank } from "src/common/enums/location-rank.enum";
export declare class ProductsService {
    private readonly productModel;
    private readonly supplyBatchModel;
    private readonly logger;
    constructor(productModel: Model<Product>, supplyBatchModel: Model<SupplyBatch>);
    createProduct(createProductDTO: CreateProductDTO): Promise<Product>;
    findAllProducts(): Promise<PopulatedProduct[]>;
    findProductById(id: string): Promise<PopulatedProduct>;
    updateProduct(id: string, updateProductDTO: UpdateProductDTO): Promise<Product>;
    deleteProduct(id: string): Promise<void>;
    getProductStock(productId: string): Promise<number>;
    getProductAveragePrice(productId: string): Promise<{
        totalQuantity: number;
        totalPurchasePrice: number;
        totalSellingPriceGold: number;
        totalSellingPriceSilver: number;
        totalSellingPriceBronze: number;
        averagePurchasePrice: number;
        averageSellingPriceGold: number;
        averageSellingPriceSilver: number;
        averageSellingPriceBronze: number;
    }>;
    getLowStockProducts(): Promise<Product[]>;
    createSupplyBatch(createSupplyBatchDTO: CreateSupplyBatchDTO): Promise<SupplyBatch>;
    retrieveStock(productId: string, quantity: number): Promise<{
        productName: string;
        usedBatches: any[];
    }>;
    retrieveNormalProductStock(productId: string, quantity: number, rank: LocationRank): Promise<{
        productName: string;
        usedBatches: NormalProductUsedBatch[];
    }>;
    findRawMaterials(): Promise<PopulatedProduct[]>;
    findNormalProducts(): Promise<PopulatedProduct[]>;
    convertRawMaterialsToProduct(rawMaterials: {
        productId: string;
        quantityUsed: number;
    }[], producedProductId: string, producedQuantity: number, sellingPrices: {
        gold: number;
        silver: number;
        bronze: number;
    }): Promise<SupplyBatch>;
}
