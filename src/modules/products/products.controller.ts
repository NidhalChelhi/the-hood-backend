import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDTO } from "./dto/create-product.dto";
import { ReceivingNoteDTO } from "./dto/receiving-note.dto";
import { Product } from "./product.schema";
import { Public } from "src/common/decorators/public.decorator";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { ConvertRawMaterialsDTO } from "./dto/convert-raw-materials.dto";

@Public()
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get("normal")
  async findNormalProducts(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string
  ): Promise<{ data: Product[]; total: number }> {
    return this.productsService.findNormalProducts(page, limit, search);
  }

  @Get("raw-materials")
  async findRawMaterials(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string
  ): Promise<{ data: Product[]; total: number }> {
    return this.productsService.findRawMaterials(page, limit, search);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDTO): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string
  ): Promise<{ data: Product[]; total: number }> {
    return this.productsService.findAll(page, limit, search);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDTO
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Product> {
    return this.productsService.remove(id);
  }

  @Post("add-quantity")
  async addQuantity(
    @Body() receivingNoteDto: ReceivingNoteDTO
  ): Promise<Product> {
    return this.productsService.addQuantity(receivingNoteDto);
  }

  @Put(":id/toggle-status")
  async toggleStatus(@Param("id") id: string): Promise<Product> {
    return this.productsService.toggleStatus(id);
  }

  @Post("convert")
  async convertRawMaterials(
    @Body() convertRawMaterialsDto: ConvertRawMaterialsDTO
  ): Promise<Product> {
    return this.productsService.convertRawMaterials(convertRawMaterialsDto);
  }
}
