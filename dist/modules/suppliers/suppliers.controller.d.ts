import { SuppliersService } from './suppliers.service';
import { CreateSupplierDTO } from './dto/create-supplier.dto';
import { UpdateSupplierDTO } from './dto/update-supplier.dto';
import { AddProductDTO } from './dto/add-product.dto';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    createSupplier(createSupplierDTO: CreateSupplierDTO): Promise<import("mongoose").Document<unknown, {}, import("./supplier.schema").Supplier> & import("./supplier.schema").Supplier & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAllSuppliers(): Promise<import("./supplier.schema").Supplier[]>;
    findSupplierById(id: string): Promise<import("./supplier.schema").Supplier>;
    addProducts(id: string, addProductDTO: AddProductDTO): Promise<import("./supplier.schema").Supplier>;
    deleteProducts(id: string, deleteProductDTO: AddProductDTO): Promise<import("./supplier.schema").Supplier>;
    updateSupplier(id: string, updateSupplierDTO: UpdateSupplierDTO): Promise<import("./supplier.schema").Supplier>;
    deleteSupplier(id: string): Promise<{
        message: string;
    }>;
}
