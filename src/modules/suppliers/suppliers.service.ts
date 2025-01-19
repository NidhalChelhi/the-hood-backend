import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './supplier.schema';
import mongoose, { Model } from 'mongoose';
import { CreateSupplierDTO } from './dto/create-supplier.dto';
import { UpdateSupplierDTO } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
    private readonly logger = new Logger(SuppliersService.name);

    constructor(@InjectModel(Supplier.name) private readonly supplierModel: Model<Supplier>) { }


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

    async findAllSuppliers(): Promise<Supplier[]> {
        try {
            return await this.supplierModel.find();
        } catch (error) {
            this.logger.error("Error fetching suppliers : ", error.message);
            throw new BadRequestException(`Failed to fetch suppliers : ${error.message}`)
        }
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
            throw new BadRequestException(`Failed to fetch suppliers : ${error.message}`)
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
            throw new BadRequestException(`Failed to update suppliers : ${error.message}`);
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
            throw new BadRequestException(`Failed to delete suppliers : ${error.message}`)
        }
    }

    async addProducts(id: string, productNames: string[]): Promise<Supplier> {
        try {
            const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
            if (!isValidObjectId) {
                throw new BadRequestException(`Invalid supplier ID provided : ${id}`);
            }

            const supplier = await this.findSupplierById(id);
            supplier.products.push(...productNames);
            return await supplier.save();
        } catch (error) {
            this.logger.error("Error adding products to supplier:", error.message);
            throw new BadRequestException(
                `Failed to add products to supplier: ${error.message}`
            );
        }
    }
    async deleteProducts(id: string, productNames: string[]): Promise<Supplier> {
        try {
            const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
            if (!isValidObjectId) {
                throw new BadRequestException(`Invalid supplier ID provided : ${id}`);
            }

            const supplier = await this.findSupplierById(id);
            supplier.products = supplier.products.filter(product => !productNames.includes(product));
            return await supplier.save();
        } catch (error) {
            this.logger.error("Error deleting products from supplier:", error.message);
            throw new BadRequestException(
                `Failed to delete products from supplier: ${error.message}`
            );
        }
    }
}