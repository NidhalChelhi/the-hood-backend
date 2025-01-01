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
        const client = await this.ClientModel.create(createClientDto);
        return await client.save();
    }
    async findAll(searchQuery) {
        try {
            let options = {};
            if (searchQuery.name) {
                options = {
                    $expr: {
                        $regexMatch: {
                            input: { $concat: ["$firstName", "$lastName"] },
                            regex: searchQuery.name,
                            options: 'i'
                        }
                    }
                };
            }
            const query = this.ClientModel.find(options);
            if (searchQuery.sort) {
                const sortCriteria = (searchQuery.sort === 'asc') ? 1 : -1;
                query.sort({
                    "firstName": sortCriteria,
                    "lastName": sortCriteria
                });
            }
            if (searchQuery.pointSort) {
                const sortCriteria = (searchQuery.pointSort === 'asc') ? 1 : -1;
                query.sort({
                    "points": sortCriteria
                });
            }
            const pageNumber = Math.max((searchQuery.page || 1), 1);
            const limit = 10;
            const totalElems = await this.countDocs(options);
            const totalPages = Math.ceil(totalElems / limit);
            if (pageNumber > totalPages && totalPages !== 0) {
                throw new common_1.BadRequestException(`Page Number bigger than total pages total Pages : ${totalPages}, your request page number : ${pageNumber}`);
            }
            const clients = await query.skip((pageNumber - 1) * limit).limit(limit).exec();
            return {
                clients,
                pageNumber,
                totalElems,
                totalPages
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to get clients : ${error.message}`);
        }
    }
    async countDocs(options) {
        return await this.ClientModel.countDocuments(options).exec();
    }
    async findById(id) {
        return await this.ClientModel.findById(id);
    }
    async findByBarCode(barCode) {
        return await this.ClientModel.findOne({ barCode: barCode });
    }
    async addPoints(id, amount) {
        try {
            await this.findById(id);
            const client = await this.ClientModel.findByIdAndUpdate(id, {
                $inc: { points: amount },
            }, { new: true, runValidators: true }).exec();
            return client.points;
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