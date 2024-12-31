import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { CreateSupplyBatchDTO } from "./dto/create-supply-batch.dto";
import { Public } from "src/common/decorators/public.decorator";
import { ProductQueryDTO } from "./dto/product-query.dto";

@Public()
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() createProductDTO: CreateProductDTO) {
    return this.productsService.createProduct(createProductDTO);
  }

  @Get()
  async findAllProducts(@Query() serachQuery : ProductQueryDTO) {
    return this.productsService.findAllProducts(serachQuery);
  }

  @Get("raw-materials")
  async findRawMaterials() {
    return this.productsService.findRawMaterials();
  }

  @Get("normal-products")
  async findNormalProducts() {
    return this.productsService.findNormalProducts();
  }

  @Get("low-stock")
  async getLowStockProducts() {
    return this.productsService.getLowStockProducts();
  }

  @Get(":id/stock")
  async getProductStock(@Param("id") id: string) {
    return this.productsService.getProductStock(id);
  }

  @Post(":id/supply-batch")
  async createSupplyBatch(
    @Param("id") productId: string,
    @Body() createSupplyBatchDTO: Omit<CreateSupplyBatchDTO, "productId">
  ) {
    return this.productsService.createSupplyBatch({
      ...createSupplyBatchDTO,
      productId,
    });
  }

  @Post(":id/retrieve-stock")
  async retrieveStock(
    @Param("id") productId: string,
    @Body() { quantity }: { quantity: number }
  ) {
    return this.productsService.retrieveStock(productId, quantity);
  }

  @Post("convert")
  async convertRawMaterialsToProduct(
    @Body()
    conversionDetails: {
      rawMaterials: { productId: string; quantityUsed: number }[];
      producedProductId: string;
      producedQuantity: number;
      sellingPrices: { gold: number; silver: number; bronze: number };
    }
  ) {
    return this.productsService.convertRawMaterialsToProduct(
      conversionDetails.rawMaterials,
      conversionDetails.producedProductId,
      conversionDetails.producedQuantity,
      conversionDetails.sellingPrices
    );
  }

  @Get(":id")
  async findProductById(@Param("id") id: string) {
    return this.productsService.findProductById(id);
  }

  @Patch(":id")
  async updateProduct(
    @Param("id") id: string,
    @Body() updateProductDTO: UpdateProductDTO
  ) {
    return this.productsService.updateProduct(id, updateProductDTO);
  }

  @Delete(":id")
  async deleteProduct(@Param("id") id: string) {
    await this.productsService.deleteProduct(id);
    return { message: "Product deleted successfully" };
  }
}
