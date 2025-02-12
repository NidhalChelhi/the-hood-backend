import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDTO } from "./dto/create-supplier.dto";
import { UpdateSupplierDTO } from "./dto/update-supplier.dto";
import { Supplier } from "./supplier.schema";
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    createSupplier(createSupplierDTO: CreateSupplierDTO): Promise<import("mongoose").Document<unknown, {}, Supplier> & Supplier & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Supplier[];
        total: number;
    }>;
    findSupplierById(id: string): Promise<Supplier>;
    updateSupplier(id: string, updateSupplierDTO: UpdateSupplierDTO): Promise<Supplier>;
    deleteSupplier(id: string): Promise<{
        message: string;
    }>;
}
