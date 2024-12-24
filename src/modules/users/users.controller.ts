import {
  Post,
  Get,
  Patch,
  Delete,
  Controller,
  Param,
  Body,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles("admin")
  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    return this.usersService.createUser(createUserDTO);
  }

  @Roles("admin")
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Roles("admin")
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  @Roles("admin")
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDTO: UpdateUserDTO) {
    return this.usersService.updateUser(id, updateUserDTO);
  }

  @Roles("admin")
  @Delete(":id")
  async delete(@Param("id") id: string) {
    await this.usersService.deleteUser(id);
    return { message: "User deleted successfully" };
  }
}
