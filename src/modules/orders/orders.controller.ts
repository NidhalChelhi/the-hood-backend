import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { CreateProductOrderDTO } from "./dto/create-product-order.dto";
import { UpdateProductOrderDTO } from "./dto/update-product-order.dto";

@Controller("orders")
export class OrdersController{
    constructor(private readonly orderService : OrdersService) {}

    @Roles("restaurant_manager")
    @Post()
    async create(@Body() createOrderDTO : CreateOrderDTO){
        return await this.orderService.createOrder(createOrderDTO);
    }

    @Roles("admin")
    @Get()
    async findAll() {
        return await this.orderService.findAllOrders();
    }


    //TODO add checking to ensure a restaurant manager can find his own orders only
    @Roles("admin")
    @Get(":id")
    async findById(@Param("id") id : string){
        return await this.orderService.findById(id);
    }

    @Roles("restaurant_manager")
    @Get("resto")
    async findAllForUser(@Req() req){
        return await this.orderService.findOrdersForUser(req.user?.userId);
    }

    @Roles("restaurant_manager")
    @Post("product-order/:id")
    async addProductOrder(@Param("id") id : string, createProductOrderDTO : CreateProductOrderDTO){
        return await this.orderService.addProductOrder(id, createProductOrderDTO);
    }

    @Roles("restaurant_manager", "admin")
    @Patch("product-order/:id")
    async updateProductOrder(@Param("id") id : string, @Query("product") productId : string, updateProductOrderDTO : UpdateProductOrderDTO){
        return await this.orderService.updateProductOrder(id, productId,updateProductOrderDTO);
    }

    @Roles("restaurant_manager")
    @Delete("product-order/:id")
    async deleteProductOrder(@Param("id") id : string, @Query("product") productId : string){
        return await this.orderService.deleteProductOrder(id, productId);
    }

    @Roles("restaurant_manager", "admin")
    @Delete(":id")
    async deleteOrder(@Param("id") id : string){
        return await this.orderService.deleteOrder(id);
    }

    @Roles("admin")
    @Get(":id/details")
    async getProcessingDetails(@Param("id") id : string){
        return await this.orderService.getOrderProcessingDetails(id);
    }

    @Roles("admin")
    @Put(":id")
    async validateOrder(@Param("id") id : string){
        return await this.orderService.validateOrder(id);
    }
}