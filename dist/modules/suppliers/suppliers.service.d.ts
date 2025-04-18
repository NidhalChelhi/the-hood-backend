import { Supplier } from "./supplier.schema";
import mongoose, { Model, Types } from "mongoose";
import { CreateSupplierDTO } from "./dto/create-supplier.dto";
import { UpdateSupplierDTO } from "./dto/update-supplier.dto";
export declare class SuppliersService {
    private readonly supplierModel;
    private readonly logger;
    constructor(supplierModel: Model<Supplier>);
    createSupplier(createSupplierDTO: CreateSupplierDTO): Promise<mongoose.Document<unknown, {}, Supplier> & Supplier & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAllSuppliers(page?: number, limit?: number, search?: string): Promise<{
        data: Supplier[];
        total: number;
    }>;
    findSupplierById(id: string): Promise<Supplier>;
    updateSupplier(id: string, updateSupplierDTO: UpdateSupplierDTO): Promise<Supplier>;
    deleteSupplier(id: string): Promise<void>;
    addProucts(products: {
        productId: string;
        quantity: number;
        purchasePrice: number;
    }[], supplierId: string): Promise<mongoose.Document<unknown, {}, Supplier> & Supplier & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    fixCumulation(products: {
        product: Types.ObjectId;
        quantity: number;
        price: number;
    }[]): {
        product: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
}
