import { Body, Controller, Get, NotFoundException, Param, Post, Query, Req } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoice.schema';
import { CreateInvoiceDTO } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async createInvoice(@Body() createInvoiceDTO : CreateInvoiceDTO){
    return this.invoicesService.createInvoice(createInvoiceDTO);
  }

  @Get("own")
  async findUserInvoices(
    @Req() request : any,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,

  ): Promise<{ data : Invoice[]; total : number}>{
    return this.invoicesService.findAll(page, limit, request.user.username);
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string,
  ): Promise<{ data: Invoice[]; total: number }> {
    return this.invoicesService.findAll(page, limit, search);
  }

  @Get(":id")
  async getOrder(@Param("id") invoiceId: string) {
    const order = await this.invoicesService.findOne(invoiceId);
    if (!order) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }
    return order;
  }
}
