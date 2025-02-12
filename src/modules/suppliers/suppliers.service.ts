import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Supplier } from "./supplier.schema";
import mongoose, { Model } from "mongoose";
import { CreateSupplierDTO } from "./dto/create-supplier.dto";
import { UpdateSupplierDTO } from "./dto/update-supplier.dto";

@Injectable()
export class SuppliersService {
  private readonly logger = new Logger(SuppliersService.name);

  constructor(
    @InjectModel(Supplier.name) private readonly supplierModel: Model<Supplier>
  ) {}

  async createSupplier(createSupplierDTO: CreateSupplierDTO) {
    try {
      const supplier = new this.supplierModel(createSupplierDTO);
      return await supplier.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Supplier with name '${createSupplierDTO.name}' already exists`
        );
      }
      this.logger.error("Error creating supplier:", error.message);
      throw new BadRequestException(
        `Failed to create supplier: ${error.message}`
      );
    }
  }

  async findAllSuppliers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Supplier[]; total: number }> {
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const [data, total] = await Promise.all([
      this.supplierModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.supplierModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  async findSupplierById(id: string): Promise<Supplier> {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      throw new BadRequestException(`Invalid supplier ID provided : ${id}`);
    }
    try {
      const supplier = await this.supplierModel.findById(id);
      if (!supplier) {
        throw new BadRequestException(`Supplier with id ${id} not found`);
      }
      return supplier;
    } catch (error) {
      this.logger.error("Error fetching suppliers : ", error.message);
      throw new BadRequestException(
        `Failed to fetch suppliers : ${error.message}`
      );
    }
  }

  async updateSupplier(
    id: string,
    updateSupplierDTO: UpdateSupplierDTO
  ): Promise<Supplier> {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      throw new BadRequestException(`Invalid supplier ID provided : ${id}`);
    }
    try {
      const supplier = await this.supplierModel.findByIdAndUpdate(
        id,
        updateSupplierDTO,
        { new: true, runValidators: true }
      );
      if (!supplier) {
        throw new BadRequestException(`Supplier with id ${id} not found`);
      }
      return supplier;
    } catch (error) {
      this.logger.error("Error updating suppliers : ", error.message);
      throw new BadRequestException(
        `Failed to update suppliers : ${error.message}`
      );
    }
  }

  async deleteSupplier(id: string) {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      throw new BadRequestException(`Invalid supplier ID provided : ${id}`);
    }
    try {
      const supplier = await this.supplierModel.findByIdAndDelete(id);
      if (!supplier) {
        throw new BadRequestException(`Supplier with id ${id} not found`);
      }
    } catch (error) {
      this.logger.error("Error deleting suppliers : ", error.message);
      throw new BadRequestException(
        `Failed to delete suppliers : ${error.message}`
      );
    }
  }
}
