import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Supplier } from "./supplier.schema";
import mongoose, { Model, Types } from "mongoose";
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
        .populate(
          "purchasedProducts.product",
          "_id name unit"
        )
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
      const supplier = await this.supplierModel.findById(id)
        .populate(
          "purchasedProducts.product",
          "_id name unit"
        )
      ;
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
  async addProucts(products : {productId : string; quantity : number; purchasePrice : number}[], supplierId : string){
    try{
      const supplier = await this.supplierModel.findById(supplierId);
      supplier.purchasedProducts = this.fixCumulation(supplier.purchasedProducts);
      products.forEach((product) => {
        const existingProduct = supplier.purchasedProducts.find((item) => item.product.toString() === product.productId);
        if(!existingProduct){
          supplier.purchasedProducts.push({
            product : new Types.ObjectId(product.productId),
            price: product.purchasePrice,
            quantity: product.quantity,
          });
        }else{
          const newPrice = (product.purchasePrice * product.quantity + existingProduct.price * existingProduct.quantity)/(product.quantity + existingProduct.quantity);
          existingProduct.price = newPrice;
          existingProduct.quantity += product.quantity;
        }
      })
      return await supplier.save();
    }catch(error){
      this.logger.error("Error adding products: ", error.message);
      throw new BadRequestException(
        `Failed to add products : ${error.message}`
      );
    }
  }
  fixCumulation(products : { product: Types.ObjectId; quantity: number; price: number }[]) : { product: Types.ObjectId; quantity: number; price: number }[]{
    return Object.values(
      products.reduce((acc, item)=>{
        if(!acc[item.product.toString()]){
          acc[item.product.toString()] = {
            product : item.product,
            price : item.price,
            quantity : item.quantity
          };
        }else{
          const newPrice = (item.price * item.quantity + acc[item.product.toString()].price * acc[item.product.toString()].quantity)/(item.quantity + acc[item.product.toString()].quantity);
          acc[item.product.toString()].price = newPrice;
          acc[item.product.toString()].quantity += item.quantity;
        }
        return acc;
      }, {} as Record<string,{product : Types.ObjectId; quantity : number; price : number}> )

    )
  }
}
