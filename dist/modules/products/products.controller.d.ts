import { ProductsService } from "./products.service";
import { CreateProductDTO } from "./dto/create-product.dto";
import { ReceivingNoteDTO, ReceivingNoteMultipleDTO } from "./dto/receiving-note.dto";
import { Product } from "./product.schema";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { ConvertRawMaterialsDTO } from "./dto/convert-raw-materials.dto";
import { EditQuantityDTO } from "./dto/edit-quantity.dto";
import { ReceivingNote } from "./receiving-note.schema";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDTO): Promise<Product>;
    findAll(page?: number, limit?: number, search?: string, filter?: string): Promise<{
        data: Product[];
        total: number;
    }>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDTO): Promise<Product>;
    remove(id: string): Promise<Product>;
    toggleStatus(id: string): Promise<Product>;
    addQuantity(receivingNoteDto: ReceivingNoteDTO): Promise<Product>;
    addQuantities(receivingNoteMultipleDto: ReceivingNoteMultipleDTO): Promise<Product[]>;
    editQuantity(editQuantityDto: EditQuantityDTO): Promise<Product>;
    convertRawMaterials(convertRawMaterialsDto: ConvertRawMaterialsDTO): Promise<Product>;
    findAllReceivingNotes(page?: number, limit?: number, search?: string): Promise<{
        data: ReceivingNote[];
        total: number;
    }>;
    findOneReceivingNote(id: string): Promise<ReceivingNote>;
}
