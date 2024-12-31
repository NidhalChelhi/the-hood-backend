import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Client } from "./clients.schema";
import { Model } from "mongoose";
import { SearcQueryDTO } from "src/common/dto/search-query.dto";

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

  async findAll(searchQuery : SearcQueryDTO){
    try{
    let options = {};
    if(searchQuery.name){
      options = {
        $expr : {
          $regexMatch : {
            input : { $concat : ["$firstName", "$lastName" ]},
            regex : searchQuery.name,
            options: 'i'
          }
        }
      }
    }
    const query = this.ClientModel.find(options);
    if(searchQuery.sort){
      const sortCriteria = (searchQuery.sort === 'asc') ? 1 : -1;
      query.sort({
        "firstName" : sortCriteria,
        "lastName" : sortCriteria 
      });
    }
    if(searchQuery.pointSort){
      const sortCriteria = (searchQuery.pointSort === 'asc') ? 1 : -1;
      query.sort({
        "points" : sortCriteria
      })
    }
    const pageNumber = Math.max((searchQuery.page || 1), 1);
    const limit = 10;
    const totalElems = await this.countDocs(options);
    const totalPages = Math.ceil(totalElems / limit);
    if(pageNumber > totalPages && totalPages !== 0){
        throw new BadRequestException(`Page Number bigger than total pages total Pages : ${totalPages}, your request page number : ${pageNumber}`);
    }
    const clients = await query.skip((pageNumber - 1) * limit).limit(limit).exec();
    return {
      clients,
      pageNumber,
      totalElems,
      totalPages
    }
  }catch(error){
    throw new InternalServerErrorException(`Failed to get clients : ${error.message}`)
  }
  }

  async countDocs(options){
    return await this.ClientModel.countDocuments(options).exec();
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
