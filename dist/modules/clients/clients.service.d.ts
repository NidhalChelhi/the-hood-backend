import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Client } from "./clients.schema";
import { Model, RootFilterQuery } from "mongoose";
import { ClientQueryDTO } from "./dto/client-query.dto";
import { PaginatedClients } from "./dto/paginated-client.dto";
export declare class ClientsService {
    private readonly ClientModel;
    private readonly logger;
    constructor(ClientModel: Model<Client>);
    create(createClientDto: CreateClientDto): Promise<Client>;
    findAll(searchQuery: ClientQueryDTO): Promise<PaginatedClients>;
    countDocs(options: RootFilterQuery<Client>): Promise<number>;
    findById(id: string): Promise<Client>;
    findByBarCode(barCode: string): Promise<Client>;
    addPoints(id: string, amount: number): Promise<number>;
    updateClient(id: string, updateClientDto: UpdateClientDto): Promise<import("mongoose").Document<unknown, {}, Client> & Client & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeClient(id: string): Promise<import("mongoose").Document<unknown, {}, Client> & Client & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
