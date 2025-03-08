"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ClientsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const clients_schema_1 = require("./clients.schema");
const mongoose_2 = require("mongoose");
let ClientsService = ClientsService_1 = class ClientsService {
    constructor(ClientModel) {
        this.ClientModel = ClientModel;
        this.logger = new common_1.Logger(ClientsService_1.name);
    }
    async create(createClientDto) {
        try {
            const client = await this.ClientModel.create(createClientDto);
            return await client.save();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to create client : ${error.message}`);
        }
    }
    async findAll(page = 1, limit = 10, search) {
        const query = {};
        if (search) {
            query.$expr = {
                $regexMatch: {
                    input: { $concat: ["$firstName", " ", "$lastName"] },
                    regex: search,
                    options: 'i'
                }
            };
        }
        const [data, total] = await Promise.all([
            this.ClientModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.ClientModel.countDocuments(query).exec(),
        ]);
        return { data, total };
    }
    async findById(id) {
        return await this.ClientModel.findById(id);
    }
    async findByBarCode(barCode) {
        return await this.ClientModel.findOne({ barCode: barCode });
    }
    async addPoints(id, amount) {
        try {
            console.log(await this.ClientModel.findOne({ barCode: id }));
            const client = await this.ClientModel.findOneAndUpdate({ barCode: id }, {
                $inc: { points: amount * 0.15 },
            }, { new: true, runValidators: true }).exec();
            console.log(client);
            return client;
        }
        catch (error) {
            this.logger.error(`Error adding points : ${error.message} `);
            throw new common_1.BadRequestException(`Failed to add points ${error.message}`);
        }
    }
    async payPoints(id, amount) {
        try {
            const client = await this.ClientModel.findOne({ barCode: id });
            if (client.points < amount) {
                throw new Error("Not enough points");
            }
            client.points -= amount;
            return await client.save();
        }
        catch (error) {
            this.logger.error(`Error adding points : ${error.message} `);
            throw new common_1.BadRequestException(`Failed to add points ${error.message}`);
        }
    }
    async updateClient(id, updateClientDto) {
        const updateFields = Object.entries(updateClientDto).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[`${key}`] = value;
            }
            return acc;
        }, {});
        try {
            const client = await this.ClientModel.findByIdAndUpdate(id, {
                $set: updateFields,
            }, { new: true, runValidators: true }).exec();
            return client;
        }
        catch (error) {
            this.logger.error(`Error updating client : ${error.message} `);
            throw new common_1.BadRequestException(`Failed to update client ${error.message}`);
        }
    }
    async removeClient(id) {
        return await this.ClientModel.findByIdAndDelete(id);
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = ClientsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(clients_schema_1.Client.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ClientsService);
//# sourceMappingURL=clients.service.js.map