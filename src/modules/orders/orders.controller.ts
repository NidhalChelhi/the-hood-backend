import {
  Body,
  Controller,
  Post,
  Param,
  Patch,
  Get,
  NotFoundException,
  HttpException,
  HttpStatus,
  Query,
  Req,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { UpdateOrderDTO } from "./dto/update-order.dto";
import { Public } from "src/common/decorators/public.decorator";
import { Order } from "./order.schema";

@Public()
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDTO: CreateOrderDTO) {
    // handle errors
    try {
      return await this.ordersService.createOrder(createOrderDTO);
    } catch (error) {
      throw new HttpException(
        error.message || "Erreur lors de la création de la commande",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Patch(":id/process")
  async processOrder(
    @Param("id") orderId: string,
    @Body("action") action: "decline" | "accept" | "modify",
    @Body("modifiedItems") modifiedItems?: UpdateOrderDTO["orderItems"]
  ) {
    try {
      return await this.ordersService.processOrder(
        orderId,
        action,
        modifiedItems
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Erreur lors du traitement de la commande",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get("own")
  async findUserOrders(
    @Req() request : any,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("filter") filter?: string

  ){
    return this.ordersService.findAll(page, limit, request.user.username, filter);
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string,
    @Query("filter") filter?: string
  ): Promise<{ data: Order[]; total: number }> {
    return this.ordersService.findAll(page, limit, search, filter);
  }

  @Get(":id")
  async getOrder(@Param("id") orderId: string) {
    const order = await this.ordersService.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }
}
