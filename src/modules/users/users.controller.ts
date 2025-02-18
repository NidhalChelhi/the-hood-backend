import {
  Post,
  Get,
  Patch,
  Delete,
  Controller,
  Param,
  Body,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserQueryDTO } from "./dto/user-query.dto";
import { Public } from "src/common/decorators/public.decorator";

@Public()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("managers")
  async findManagers(){
    return this.usersService.findManagers();
  }
  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    return this.usersService.createUser(createUserDTO);
  }

  @Get()
  async findAll(@Query() serachQuery : UserQueryDTO) {
    return this.usersService.findAll(serachQuery);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDTO: UpdateUserDTO) {
    return this.usersService.updateUser(id, updateUserDTO);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    await this.usersService.deleteUser(id);
    return { message: "User deleted successfully" };
  }
}
