import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Client } from "./clients.schema";
import { Model } from "mongoose";

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);
  constructor(
    @InjectModel(Client.name) private readonly ClientModel: Model<Client>
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = await this.ClientModel.create(createClientDto);
    return await client.save();
  }

  async findAll(): Promise<Client[]> {
    return await this.ClientModel.find().exec();
  }

  async findById(id: string): Promise<Client> {
    return await this.ClientModel.findById(id);
  }

  async findByBarCode(barCode: string): Promise<Client> {
    return await this.ClientModel.findOne({ barCode: barCode });
  }

  async addPoints(id: string, amount: number): Promise<number> {
    try {
      await this.findById(id);
      const client = await this.ClientModel.findByIdAndUpdate(
        id,
        {
          $inc: { points: amount },
        },
        { new: true, runValidators: true }
      ).exec();
      return client.points;
    } catch (error) {
      this.logger.error(`Error adding points : ${error.message} `);
      throw new BadRequestException(`Failed to add points ${error.message}`);
    }
  }

  async updateClient(id: string, updateClientDto: UpdateClientDto) {
    const updateFields = Object.entries(updateClientDto).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[`${key}`] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );
    try {
      const client = await this.ClientModel.findByIdAndUpdate(
        id,
        {
          $set: updateFields,
        },
        { new: true, runValidators: true }
      ).exec();

      return client;
    } catch (error) {
      this.logger.error(`Error updating client : ${error.message} `);
      throw new BadRequestException(`Failed to update client ${error.message}`);
    }
  }

  async removeClient(id: string) {
    return await this.ClientModel.findByIdAndDelete(id);
  }
}
