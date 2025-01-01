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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async createUser(createUserDTO) {
        const { username, email, password, role, location, phoneNumber } = createUserDTO;
        const existingUser = await this.userModel.findOne({
            $or: [{ username }, { email }],
        });
        if (existingUser) {
            throw new common_1.BadRequestException("User with this username or email already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new this.userModel({
            username,
            email,
            password: hashedPassword,
            role,
            location: role === "restaurant_manager" ? location : undefined,
            phoneNumber,
        });
        return newUser.save();
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async findByUsername(username) {
        return this.userModel.findOne({ username }).exec();
    }
    async findOneById(id) {
        return this.userModel.findById(id).exec();
    }
    async updateUser(id, updateUserDTO) {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, {
            ...updateUserDTO,
            location: updateUserDTO.role === "restaurant_manager"
                ? updateUserDTO.location
                : undefined,
        }, { new: true, runValidators: true });
        if (!updatedUser) {
            throw new common_1.NotFoundException("User not found");
        }
        return updatedUser;
    }
    async deleteUser(id) {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException("User not found");
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map