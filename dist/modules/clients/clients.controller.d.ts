import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientQueryDTO } from "./dto/client-query.dto";
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: CreateClientDto): Promise<import("./clients.schema").Client>;
    findAll(searchQuery: ClientQueryDTO): Promise<import("./dto/paginated-client.dto").PaginatedClients>;
    findOne(id: string): Promise<import("./clients.schema").Client>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<import("mongoose").Document<unknown, {}, import("./clients.schema").Client> & import("./clients.schema").Client & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("./clients.schema").Client> & import("./clients.schema").Client & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    addPoints(id: string, points: number): any;
}
