import { Model } from "mongoose";
import { Product } from "./product.schema";
import { ReceivingNote } from "./receiving-note.schema";
import { CreateProductDTO } from "./dto/create-product.dto";
import { ReceivingNoteDTO } from "./dto/receiving-note.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { ConvertRawMaterialsDTO } from "./dto/convert-raw-materials.dto";
export declare class ProductsService {
    private readonly productModel;
    private readonly receivingNoteModel;
    constructor(productModel: Model<Product>, receivingNoteModel: Model<ReceivingNote>);
    create(createProductDto: CreateProductDTO): Promise<Product>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Product[];
        total: number;
    }>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDTO): Promise<Product>;
    remove(id: string): Promise<Product>;
    addQuantity(receivingNoteDto: ReceivingNoteDTO): Promise<Product>;
    toggleStatus(id: string): Promise<Product>;
    convertRawMaterials(convertRawMaterialsDto: ConvertRawMaterialsDTO): Promise<Product>;
    findNormalProducts(page?: number, limit?: number, search?: string): Promise<{
        data: Product[];
        total: number;
    }>;
    findRawMaterials(page?: number, limit?: number, search?: string): Promise<{
        data: Product[];
        total: number;
    }>;
}
