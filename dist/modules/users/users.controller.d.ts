import { UsersService } from "./users.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDTO: CreateUserDTO): Promise<import("./user.schema").User>;
    findAll(): Promise<import("./user.schema").User[]>;
    findOne(id: string): Promise<import("./user.schema").User>;
    update(id: string, updateUserDTO: UpdateUserDTO): Promise<import("./user.schema").User>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
