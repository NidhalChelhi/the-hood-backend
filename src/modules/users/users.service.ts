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

  async findManagers(){
    return await this.userModel.find({role : UserRole.RestaurantManager}).select("-password");
  }
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: User[]; total: number }> {
    if (search) {
      const [data, total] = await Promise.all([
        this.userModel
        .find(
          {
            $or: [
              { username: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          },
          "-password"
        )
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
        this.userModel.countDocuments(
          {
            $or: [
              { username: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ]
          }
        )
      ])
      return { data, total}
    }else {
      const [data, total] = await Promise.all([
        this.userModel
        .find({},"-password")
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
        this.userModel.countDocuments()
      ])
      return { data, total}

    }

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
