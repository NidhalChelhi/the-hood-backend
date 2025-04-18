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
//import { Public } from "src/common/decorators/public.decorator";
import { Order } from "./order.schema";
//import { AuthCompositeGuard } from "src/common/guards/auth-composite.guard";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDTO: CreateOrderDTO, @Req() request : any) {
    // handle errors
    try {
      createOrderDTO.createdBy = request.user.userId;
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
    @Body("action") action: "decline" | "accept",
  ) {
    try {
      return await this.ordersService.processOrder(
        orderId,
        action,
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Erreur lors du traitement de la commande",
        HttpStatus.BAD_REQUEST
      );
    }
  }
  @Patch(":id")
  async updateOrder(
    @Param("id") orderId: string,
    @Body("modifiedItems") modifiedItems?: UpdateOrderDTO["orderItems"]
  ){
   return this.ordersService.updateOrder(orderId, modifiedItems)
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
