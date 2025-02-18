import { UsersService } from "./users.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserQueryDTO } from "./dto/user-query.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findManagers(): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    create(createUserDTO: CreateUserDTO): Promise<import("./user.schema").User>;
    findAll(serachQuery: UserQueryDTO): Promise<import("./dto/paginated-user.dto").PaginatedUsers>;
    findOne(id: string): Promise<import("./user.schema").User>;
    update(id: string, updateUserDTO: UpdateUserDTO): Promise<import("./user.schema").User>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
