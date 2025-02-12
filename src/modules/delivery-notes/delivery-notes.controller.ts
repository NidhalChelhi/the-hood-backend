import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { DeliveryNotesService } from "./delivery-notes.service";
import { Public } from "src/common/decorators/public.decorator";
import { DeliveryNote } from "./delivery-note.schema";

@Public()
@Controller("delivery-notes")
export class DeliveryNotesController {
  constructor(private readonly deliveryNotesService: DeliveryNotesService) {}

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string,
    @Query("filter") filter?: string
  ): Promise<{ data: DeliveryNote[]; total: number }> {
    return this.deliveryNotesService.findAll(page, limit, search, filter);
  }

  @Get(":id")
  async findOne(@Param("id") orderId: string) {
    const deliveryNote = await this.deliveryNotesService.findOne(orderId);
    if (!deliveryNote) {
      throw new NotFoundException(`Delivery note with ID ${orderId} not found`);
    }
    return deliveryNote;
  }
}
