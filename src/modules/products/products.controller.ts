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
import {
  ReceivingNoteDTO,
  ReceivingNoteMultipleDTO,
} from "./dto/receiving-note.dto";
import { Product } from "./product.schema";
import { Public } from "src/common/decorators/public.decorator";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { ConvertRawMaterialsDTO } from "./dto/convert-raw-materials.dto";
import { EditQuantityDTO } from "./dto/edit-quantity.dto";
import { ReceivingNote } from "./receiving-note.schema";

@Public()
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDTO): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string,
    @Query("filter") filter?: string
  ): Promise<{ data: Product[]; total: number }> {
    return this.productsService.findAll(page, limit, search, filter);
  }
  @Get("all")
  async unpaginatedProducts() : Promise<Product[]>{
    return this.productsService.findAllUnpaginated();
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

  @Put(":id/toggle-status")
  async toggleStatus(@Param("id") id: string): Promise<Product> {
    return this.productsService.toggleStatus(id);
  }

  @Post("add-quantity")
  async addQuantity(
    @Body() receivingNoteDto: ReceivingNoteDTO
  ): Promise<Product> {
    return this.productsService.addQuantity(receivingNoteDto);
  }

  @Post("add-quantities")
  async addQuantities(
    @Body() receivingNoteMultipleDto: ReceivingNoteMultipleDTO
  ): Promise<Product[]> {
    return this.productsService.addQuantities(receivingNoteMultipleDto);
  }

  @Put("edit-quantity")
  async editQuantity(
    @Body() editQuantityDto: EditQuantityDTO
  ): Promise<Product> {
    return this.productsService.editQuantity(editQuantityDto);
  }

  @Post("convert")
  async convertRawMaterials(
    @Body() convertRawMaterialsDto: ConvertRawMaterialsDTO
  ): Promise<Product> {
    return this.productsService.convertRawMaterials(convertRawMaterialsDto);
  }

  @Get("receiving-notes/all")
  async findAllReceivingNotes(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string
  ): Promise<{ data: ReceivingNote[]; total: number }> {
    return this.productsService.findAllReceivingNotes(page, limit, search);
  }

  @Get("receiving-notes/:id")
  async findOneReceivingNote(@Param("id") id: string): Promise<ReceivingNote> {
    return this.productsService.findOneReceivingNote(id);
  }
}
