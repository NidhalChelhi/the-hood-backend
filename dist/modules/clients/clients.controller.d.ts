import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Client } from "./clients.schema";
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: CreateClientDto): Promise<Client>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Client[];
        total: number;
    }>;
    addPoints(id: string, body: {
        points: number;
    }): Promise<Client>;
    pay(id: string, body: {
        points: number;
    }): Promise<Client>;
    findOne(id: string): Promise<Client>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<import("mongoose").Document<unknown, {}, Client> & Client & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, Client> & Client & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
