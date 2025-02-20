import { UsersService } from "./users.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { User } from "./user.schema";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findManagers(): Promise<(import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOwn(request: any): Promise<User>;
    create(createUserDTO: CreateUserDTO): Promise<User>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: User[];
        total: number;
    }>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDTO: UpdateUserDTO): Promise<User>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
