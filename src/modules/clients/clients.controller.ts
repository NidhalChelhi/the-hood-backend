import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Public } from "src/common/decorators/public.decorator";
import { Client } from "./clients.schema";

//@Roles("restaurant_manager", "admin")
@Public()
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string,
  ) : Promise<{data : Client[]; total : number}>{
    return this.clientsService.findAll(page, limit, search);
  }

  @Post("points/:id")
  async addPoints(@Param("id") id: string, @Body() body : { points : number }) {
    return this.clientsService.addPoints(id, body.points);
  }
  @Post("pay/:id")
  async pay(@Param("id") id: string, @Body() body : { points: number }) {

    return this.clientsService.payPoints(id, body.points);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.clientsService.findById(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateClientDto: UpdateClientDto
  ) {
    return this.clientsService.updateClient(id, updateClientDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.clientsService.removeClient(id);
  }

}
