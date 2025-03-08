import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Client } from "./clients.schema";
import { Model, RootFilterQuery } from "mongoose";

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);
  constructor(
    @InjectModel(Client.name) private readonly ClientModel: Model<Client>
  ) { }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    try {
      const client = await this.ClientModel.create(createClientDto);
      return await client.save();
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create client : ${error.message}`)
    }
  }
  async findAll(
    page : number = 1,
    limit : number = 10,
    search? : string,
  ){
    const query : RootFilterQuery<Client> = {};
    if(search){
      query.$expr = {
        $regexMatch: {
          input: { $concat: ["$firstName"," ", "$lastName"] },
          regex: search,
          options: 'i'
        }
      }
    }
    const [data, total] = await Promise.all([
      this.ClientModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
        this.ClientModel.countDocuments(query).exec(),
    ]);
    return { data, total }
  }


  async findById(id: string): Promise<Client> {
    return await this.ClientModel.findById(id);
  }

  async findByBarCode(barCode: string): Promise<Client> {
    return await this.ClientModel.findOne({ barCode: barCode });
  }

  async addPoints(id: string, amount: number): Promise<Client> {
    try {
      console.log(await this.ClientModel.findOne({barCode : id}));
      const client = await this.ClientModel.findOneAndUpdate(
        {barCode : id},
        {
          $inc: { points: amount * 0.15 },
        },
        { new: true, runValidators: true }
      ).exec();
      console.log(client)
      return client;
    } catch (error) {
      this.logger.error(`Error adding points : ${error.message} `);
      throw new BadRequestException(`Failed to add points ${error.message}`);
    }
  }
  async payPoints(id: string, amount: number): Promise<Client> {
    try {
      const client = await this.ClientModel.findOne({barCode : id});
      if(client.points < amount){
        throw new Error("Not enough points");
      }
      client.points -= amount;
      return await client.save();
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
