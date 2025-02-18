import { Model, RootFilterQuery } from "mongoose";
import { User } from "./user.schema";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserQueryDTO } from "./dto/user-query.dto";
import { PaginatedUsers } from "./dto/paginated-user.dto";
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    createUser(createUserDTO: CreateUserDTO): Promise<User>;
    findManagers(): Promise<(import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findAll(searchQuery: UserQueryDTO): Promise<PaginatedUsers>;
    countDocs(options: RootFilterQuery<User>): Promise<number>;
    findLikeUserName(username: string): Promise<User[]>;
    findByUsername(username: string): Promise<User | null>;
    findOneById(id: string): Promise<User | null>;
    updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User>;
    deleteUser(id: string): Promise<void>;
}
