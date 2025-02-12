import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  Query,
} from "@nestjs/common";
import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDTO } from "./dto/create-supplier.dto";
import { UpdateSupplierDTO } from "./dto/update-supplier.dto";
import { Public } from "src/common/decorators/public.decorator";
import { Supplier } from "./supplier.schema";

@Public()
@Controller("suppliers")
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  async createSupplier(@Body() createSupplierDTO: CreateSupplierDTO) {
    return this.suppliersService.createSupplier(createSupplierDTO);
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string
  ): Promise<{ data: Supplier[]; total: number }> {
    return this.suppliersService.findAllSuppliers(page, limit, search);
  }

  @Get(":id")
  async findSupplierById(@Param("id") id: string) {
    return this.suppliersService.findSupplierById(id);
  }

  @Patch(":id")
  async updateSupplier(
    @Param("id") id: string,
    @Body() updateSupplierDTO: UpdateSupplierDTO
  ) {
    return this.suppliersService.updateSupplier(id, updateSupplierDTO);
  }

  @Delete(":id")
  async deleteSupplier(@Param("id") id: string) {
    await this.suppliersService.deleteSupplier(id);
    return { message: "Supplier deleted successfully" };
  }
}
