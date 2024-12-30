import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Roles } from "../../common/decorators/roles.decorator";

@Roles("restaurant_manager", "admin")
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  async findAll() {
    return this.clientsService.findAll();
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

  @Post("points/:id")
  async addPoints(@Param("id") id: string, @Body() points: number) {
    return this.addPoints(id, points);
  }
}
