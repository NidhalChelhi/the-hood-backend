import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { CreateProductOrderDTO } from "./dto/create-product-order.dto";
import { UpdateProductOrderDTO } from "./dto/update-product-order.dto";
import { ProductOrderPriceDTO } from "./dto/product-order-price.dto";
import { ProductQueryDTO } from "./dto/product-query.dto";
import { SearcQueryDTO } from "../../common/dto/search-query.dto";

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
    async findAll(@Query() queryParams : SearcQueryDTO) {
        return await this.orderService.findAllOrders(queryParams);
    }


    //TODO add checking to ensure a restaurant manager can find his own orders only
    @Roles("admin")
    @Get(":id")
    async findById(@Param("id") id : string){
        return await this.orderService.findById(id);
    }

    @Roles("restaurant_manager")
    @Get("resto/info")
    async findAllForUser(@Req() req, @Query() queryParams : SearcQueryDTO){
        return await this.orderService.findOrdersForUser(req.user?.userId, queryParams);
    }

    @Roles("restaurant_manager")
    @Post("product-order/:id")
    async addProductOrder(@Param("id") id : string,@Body() createProductOrderDTO : CreateProductOrderDTO){
        console.log(createProductOrderDTO);
        return await this.orderService.addProductOrder(id, createProductOrderDTO);
    }

    @Roles("admin")
    @Patch("product-order/:id")
    async updateProductOrder(@Param("id") id : string, @Query() product : ProductQueryDTO, updateProductOrderDTO : UpdateProductOrderDTO){
        return await this.orderService.updateProductOrder(id, product.productId,updateProductOrderDTO);
    }

    //De preferance nahiwha hedhi l resto manager ma andou lhak ken yasna3 commande
    @Roles("restaurant_manager")
    @Delete("product-order/:id")
    async deleteProductOrder(@Param("id") id : string, @Query() product : ProductQueryDTO){
        return await this.orderService.deleteProductOrder(id, product.productId);
    }

    @Roles("restaurant_manager")
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
    @Roles("admin")
    @Put("average-price/:id")
    async validateOrderAveragePrice(@Param("id") id : string){
        return await this.orderService.validateOrderWithAveragePrice(id);
    }

    @Roles("admin")
    @Patch("valid-order/:id")
    async changeProductOrderPrice(@Param("id") id : string, @Query() product : ProductQueryDTO, @Body() productOrderPriceDTO : ProductOrderPriceDTO){
        return await this.orderService.changeProductOrderPrice(id, product.productId, productOrderPriceDTO);
    }

    @Roles("admin")
    @Patch("valid-order/confirm/:id")
    async confirmOrder(@Param("id") id : string){
        return await this.orderService.confirmOrder(id);
    }
}
