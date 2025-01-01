import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, RootFilterQuery } from "mongoose";
import { User } from "./user.schema";
import { CreateUserDTO } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserQueryDTO } from "./dto/user-query.dto";
import { PaginatedUsers } from "./dto/paginated-user.dto";
import { UserRole } from "src/common/enums/roles.enum";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const { username, email, password, role, location, phoneNumber } =
      createUserDTO;

    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new BadRequestException(
        "User with this username or email already exists"
      );
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

  async findAll(searchQuery: UserQueryDTO): Promise<PaginatedUsers> {
    const options: RootFilterQuery<User> = { $and: [] };
    if (searchQuery.name) {
      options.$and.push({
        $expr: {
          $regexMatch: {
            input: "$username",
            regex: searchQuery.name,
            options: "i",
          },
        },
      });
    }
    if (searchQuery.locationName) {
      options.$and.push({
        $expr: {
          $regexMatch: {
            input: "$location.name",
            regex: searchQuery.locationName,
            options: "i",
          },
        },
      });
    }
    if (searchQuery.locationRank) {
      options.$and.push({
        "location.rank": searchQuery.locationRank,
      });
    }
    const query = this.userModel.find(options);
    if (searchQuery.sort) {
      const sortCriteria = searchQuery.sort === "asc" ? 1 : -1;
      query.sort({
        username: sortCriteria,
      });
    }
    const pageNumber = Math.max(searchQuery.page || 1, 1);
    const limit = 10;
    const totalElems = await this.countDocs(options);
    const totalPages = Math.ceil(totalElems / limit);
    if (pageNumber > totalPages && totalPages !== 0) {
      throw new BadRequestException(
        `Page Number bigger than total pages total Pages : ${totalPages}, your request page number : ${pageNumber}`
      );
    }

    const users = await query
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .exec();
    return {
      users,
      pageNumber,
      totalElems,
      totalPages,
    };
  }

  async countDocs(options: RootFilterQuery<User>) {
    return await this.userModel.countDocuments(options);
  }

  // This is only for internal use in the order module, you can simply use the find all function to search by username
  async findLikeUserName(username: string): Promise<User[]> {
    const options: RootFilterQuery<User> = {
      $and: [
        {
          $expr: {
            $regexMatch: {
              input: "$username",
              regex: username,
              options: "i",
            },
          },
        },
        { role : UserRole.RestaurantManager }
      ],
    };
    return await this.userModel.find(options).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        ...updateUserDTO,
        location:
          updateUserDTO.role === "restaurant_manager"
            ? updateUserDTO.location
            : undefined,
      },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("User not found");
    }
  }
}
