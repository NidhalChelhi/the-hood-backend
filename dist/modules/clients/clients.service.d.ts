import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Client } from "./clients.schema";
import { Model } from "mongoose";
export declare class ClientsService {
    private readonly ClientModel;
    private readonly logger;
    constructor(ClientModel: Model<Client>);
    create(createClientDto: CreateClientDto): Promise<Client>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, Client> & Client & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<Client>;
    findByBarCode(barCode: string): Promise<Client>;
    addPoints(id: string, amount: number): Promise<Client>;
    payPoints(id: string, amount: number): Promise<Client>;
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
