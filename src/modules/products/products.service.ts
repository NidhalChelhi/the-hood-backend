import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "./product.schema";
import { ReceivingNote } from "./receiving-note.schema";
import { CreateProductDTO } from "./dto/create-product.dto";
import { ReceivingNoteDTO } from "./dto/receiving-note.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { ConvertRawMaterialsDTO } from "./dto/convert-raw-materials.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(ReceivingNote.name)
    private readonly receivingNoteModel: Model<ReceivingNote>
  ) {}

  async create(createProductDto: CreateProductDTO): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Product[]; total: number }> {
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const [data, total] = await Promise.all([
      this.productModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDTO
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return deletedProduct;
  }

  async addQuantity(receivingNoteDto: ReceivingNoteDTO): Promise<Product> {
    const {
      productId,
      quantityAdded,
      purchasePrice,
      sellingPriceGold,
      sellingPriceSilver,
      sellingPriceBronze,
      supplierId,
    } = receivingNoteDto;

    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const totalQuantity = product.quantity + quantityAdded;
    const totalPurchasePrice =
      product.purchasePrice * product.quantity + purchasePrice * quantityAdded;
    product.purchasePrice = totalPurchasePrice / totalQuantity;

    if (sellingPriceGold !== undefined) {
      const totalSellingPriceGold =
        (product.sellingPriceGold || 0) * product.quantity +
        sellingPriceGold * quantityAdded;
      product.sellingPriceGold = totalSellingPriceGold / totalQuantity;
    }

    if (sellingPriceSilver !== undefined) {
      const totalSellingPriceSilver =
        (product.sellingPriceSilver || 0) * product.quantity +
        sellingPriceSilver * quantityAdded;
      product.sellingPriceSilver = totalSellingPriceSilver / totalQuantity;
    }

    if (sellingPriceBronze !== undefined) {
      const totalSellingPriceBronze =
        (product.sellingPriceBronze || 0) * product.quantity +
        sellingPriceBronze * quantityAdded;
      product.sellingPriceBronze = totalSellingPriceBronze / totalQuantity;
    }

    product.quantity = totalQuantity;
    product.isBelowStockLimit = product.quantity <= product.stockLimit;
    product.isActive = product.quantity > 0;

    await product.save();

    const receivingNote = new this.receivingNoteModel({
      product: productId,
      quantityAdded,
      purchasePrice,
      sellingPriceGold,
      sellingPriceSilver,
      sellingPriceBronze,
      supplier: supplierId,
    });
    await receivingNote.save();

    return product;
  }

  async toggleStatus(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.isActive = !product.isActive;
    await product.save();

    return product;
  }

  async convertRawMaterials(
    convertRawMaterialsDto: ConvertRawMaterialsDTO
  ): Promise<Product> {
    const {
      rawMaterials,
      finishedProductId,
      quantityProduced,
      sellingPriceGold,
      sellingPriceSilver,
      sellingPriceBronze,
    } = convertRawMaterialsDto;

    for (const rawMaterial of rawMaterials) {
      const { rawMaterialId, quantityUsed } = rawMaterial;

      const rawMaterialProduct = await this.productModel
        .findById(rawMaterialId)
        .exec();
      if (!rawMaterialProduct) {
        throw new NotFoundException(
          `Raw material with ID ${rawMaterialId} not found`
        );
      }

      if (rawMaterialProduct.quantity < quantityUsed) {
        throw new Error(
          `Insufficient quantity for raw material ${rawMaterialProduct.name}`
        );
      }

      rawMaterialProduct.quantity -= quantityUsed;
      rawMaterialProduct.isBelowStockLimit =
        rawMaterialProduct.quantity <= rawMaterialProduct.stockLimit;
      rawMaterialProduct.isActive = rawMaterialProduct.quantity > 0;

      await rawMaterialProduct.save();
    }

    const finishedProduct = await this.productModel
      .findById(finishedProductId)
      .exec();

    if (!finishedProduct) {
      throw new NotFoundException(
        `Finished product with ID ${finishedProductId} not found`
      );
    }

    finishedProduct.quantity += quantityProduced;

    if (sellingPriceGold !== undefined) {
      finishedProduct.sellingPriceGold = sellingPriceGold;
    }
    if (sellingPriceSilver !== undefined) {
      finishedProduct.sellingPriceSilver = sellingPriceSilver;
    }
    if (sellingPriceBronze !== undefined) {
      finishedProduct.sellingPriceBronze = sellingPriceBronze;
    }

    finishedProduct.isBelowStockLimit =
      finishedProduct.quantity <= finishedProduct.stockLimit;
    finishedProduct.isActive = finishedProduct.quantity > 0;

    await finishedProduct.save();

    return finishedProduct;
  }

  async findNormalProducts(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Product[]; total: number }> {
    const query: any = { isRawMaterial: false };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const [data, total] = await Promise.all([
      this.productModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  async findRawMaterials(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Product[]; total: number }> {
    const query: any = { isRawMaterial: true };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const [data, total] = await Promise.all([
      this.productModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }
}
