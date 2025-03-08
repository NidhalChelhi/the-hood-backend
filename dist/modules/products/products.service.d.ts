import { Model, Types } from "mongoose";
import { Product } from "./product.schema";
import { ReceivingNote } from "./receiving-note.schema";
import { CreateProductDTO } from "./dto/create-product.dto";
import { ReceivingNoteDTO, ReceivingNoteMultipleDTO } from "./dto/receiving-note.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { ConvertRawMaterialsDTO } from "./dto/convert-raw-materials.dto";
import { EditQuantityDTO } from "./dto/edit-quantity.dto";
import { Supplier } from "../suppliers/supplier.schema";
import { SuppliersService } from "../suppliers/suppliers.service";
export declare class ProductsService {
    private readonly productModel;
    private readonly receivingNoteModel;
    private readonly supplierModel;
    private readonly supplierService;
    constructor(productModel: Model<Product>, receivingNoteModel: Model<ReceivingNote>, supplierModel: Model<Supplier>, supplierService: SuppliersService);
    create(createProductDto: CreateProductDTO): Promise<Product>;
    findAll(page?: number, limit?: number, search?: string, filter?: string): Promise<{
        data: Product[];
        total: number;
    }>;
    findAllUnpaginated(): Promise<(import("mongoose").Document<unknown, {}, Product> & Product & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDTO): Promise<Product>;
    remove(id: string): Promise<Product>;
    addQuantity(receivingNoteDto: ReceivingNoteDTO): Promise<Product>;
    toggleStatus(id: string): Promise<Product>;
    convertRawMaterials(convertRawMaterialsDto: ConvertRawMaterialsDTO): Promise<Product>;
    updateProductStock(orderItems: {
        product: Types.ObjectId;
        quantity: number;
    }[]): Promise<void>;
    addQuantities(receivingNoteMultipleDto: ReceivingNoteMultipleDTO): Promise<Product[]>;
    editQuantity(editQuantityDto: EditQuantityDTO): Promise<Product>;
    findAllReceivingNotes(page?: number, limit?: number, search?: string): Promise<{
        data: ReceivingNote[];
        total: number;
    }>;
    findOneReceivingNote(id: string): Promise<ReceivingNote>;
}
