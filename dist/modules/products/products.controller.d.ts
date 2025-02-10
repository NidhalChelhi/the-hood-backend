import { ProductsService } from "./products.service";
import { CreateProductDTO } from "./dto/create-product.dto";
import { ReceivingNoteDTO } from "./dto/receiving-note.dto";
import { Product } from "./product.schema";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { ConvertRawMaterialsDTO } from "./dto/convert-raw-materials.dto";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findNormalProducts(page?: number, limit?: number, search?: string): Promise<{
        data: Product[];
        total: number;
    }>;
    findRawMaterials(page?: number, limit?: number, search?: string): Promise<{
        data: Product[];
        total: number;
    }>;
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
}
