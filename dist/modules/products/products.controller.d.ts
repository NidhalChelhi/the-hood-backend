import { ProductsService } from "./products.service";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { CreateSupplyBatchDTO } from "./dto/create-supply-batch.dto";
import { ProductQueryDTO } from "./dto/product-query.dto";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(createProductDTO: CreateProductDTO): Promise<import("./product.schema").Product>;
    findAllProducts(serachQuery: ProductQueryDTO): Promise<import("./dto/paginated-product.dto").PaginatedProducts>;
    findRawMaterials(): Promise<import("./types").PopulatedProduct[]>;
    findNormalProducts(): Promise<import("./types").PopulatedProduct[]>;
    getLowStockProducts(): Promise<import("./product.schema").Product[]>;
    getProductStock(id: string): Promise<number>;
    createSupplyBatch(productId: string, createSupplyBatchDTO: Omit<CreateSupplyBatchDTO, "productId">): Promise<import("./product.schema").SupplyBatch>;
    retrieveStock(productId: string, { quantity }: {
        quantity: number;
    }): Promise<{
        productName: string;
        usedBatches: any[];
    }>;
    convertRawMaterialsToProduct(conversionDetails: {
        rawMaterials: {
            productId: string;
            quantityUsed: number;
        }[];
        producedProductId: string;
        producedQuantity: number;
        sellingPrices: {
            gold: number;
            silver: number;
            bronze: number;
        };
    }): Promise<import("./product.schema").SupplyBatch>;
    findProductById(id: string): Promise<import("./types").PopulatedProduct>;
    updateProduct(id: string, updateProductDTO: UpdateProductDTO): Promise<import("./product.schema").Product>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
}
