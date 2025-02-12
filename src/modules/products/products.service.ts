import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Product } from "./product.schema";
import { ReceivingNote } from "./receiving-note.schema";
import { CreateProductDTO } from "./dto/create-product.dto";
import {
  ReceivingNoteDTO,
  ReceivingNoteMultipleDTO,
} from "./dto/receiving-note.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { ConvertRawMaterialsDTO } from "./dto/convert-raw-materials.dto";
import { EditQuantityDTO } from "./dto/edit-quantity.dto";
import { Supplier } from "../suppliers/supplier.schema";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(ReceivingNote.name)
    private readonly receivingNoteModel: Model<ReceivingNote>,
    @InjectModel(Supplier.name) private readonly supplierModel: Model<Supplier>
  ) {}

  async create(createProductDto: CreateProductDTO): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filter?: string
  ): Promise<{ data: Product[]; total: number }> {
    const query: any = {};

    if (filter) {
      if (filter === "normal") {
        query.isRawMaterial = false;
      } else if (filter === "raw") {
        query.isRawMaterial = true;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
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
      supplier,
    } = receivingNoteDto;

    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const totalQuantity = product.quantity + quantityAdded;
    const totalPurchasePrice =
      product.purchasePrice * product.quantity + purchasePrice * quantityAdded;
    product.purchasePrice = totalPurchasePrice / totalQuantity;

    if (!product.isRawMaterial) {
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
    }

    product.quantity = totalQuantity;
    product.isBelowStockLimit = product.quantity <= product.stockLimit;
    product.isActive = product.quantity > 0;

    await product.save();

    const receivingNote = new this.receivingNoteModel({
      items: [
        {
          product: productId,
          quantityAdded,
          purchasePrice,
          sellingPriceGold,
          sellingPriceSilver,
          sellingPriceBronze,
        },
      ],
      supplier: supplier,
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

  async updateProductStock(
    orderItems: { product: Types.ObjectId; quantity: number }[]
  ) {
    for (const item of orderItems) {
      const product = await this.productModel.findById(item.product).exec();
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.product} not found`
        );
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      product.quantity -= item.quantity;
      await product.save();
    }
  }

  async addQuantities(
    receivingNoteMultipleDto: ReceivingNoteMultipleDTO
  ): Promise<Product[]> {
    const { items, supplier } = receivingNoteMultipleDto;

    const updatedProducts: Product[] = [];

    for (const productData of items) {
      const {
        productId,
        quantityAdded,
        purchasePrice,
        sellingPriceGold,
        sellingPriceSilver,
        sellingPriceBronze,
      } = productData;

      const product = await this.productModel.findById(productId).exec();
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      const totalQuantity = product.quantity + quantityAdded;
      const totalPurchasePrice =
        product.purchasePrice * product.quantity +
        purchasePrice * quantityAdded;
      product.purchasePrice = totalPurchasePrice / totalQuantity;

      if (!product.isRawMaterial) {
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
      }

      product.quantity = totalQuantity;
      product.isBelowStockLimit = product.quantity <= product.stockLimit;
      product.isActive = product.quantity > 0;

      await product.save();

      updatedProducts.push(product);
    }
    const receivingNote = new this.receivingNoteModel({
      items: items.map((productData) => ({
        product: productData.productId,
        quantityAdded: productData.quantityAdded,
        purchasePrice: productData.purchasePrice,
        sellingPriceGold: productData.sellingPriceGold,
        sellingPriceSilver: productData.sellingPriceSilver,
        sellingPriceBronze: productData.sellingPriceBronze,
      })),
      supplier: supplier,
    });

    await receivingNote.save();

    return updatedProducts;
  }

  async editQuantity(editQuantityDto: EditQuantityDTO): Promise<Product> {
    const { productId, quantityChange } = editQuantityDto;

    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const newQuantity = product.quantity + quantityChange;
    if (newQuantity < 0) {
      throw new BadRequestException("Quantity cannot be negative");
    }

    product.quantity = newQuantity;
    product.isBelowStockLimit = product.quantity <= product.stockLimit;
    product.isActive = product.quantity > 0;

    await product.save();

    return product;
  }

  async findAllReceivingNotes(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: ReceivingNote[]; total: number }> {
    const query: any = {};

    if (search) {
      const matchingProducts = await this.productModel
        .find(
          {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          },
          "_id"
        )

        .exec();

      const matchingSuppliers = await this.supplierModel
        .find(
          {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { contact: { $regex: search, $options: "i" } },
              { address: { $regex: search, $options: "i" } },
            ],
          },
          "_id"
        )
        .exec();

      const productIds = matchingProducts.map((product) => product._id);
      const suppliers = matchingSuppliers.map((supplier) => supplier._id);

      if (productIds.length > 0 || suppliers.length > 0) {
        query.$or = [
          { "items.product": { $in: productIds } },
          { supplier: { $in: suppliers } },
        ];
      } else {
        return { data: [], total: 0 };
      }
    }
    const [data, total] = await Promise.all([
      this.receivingNoteModel
        .find(query)
        .populate(
          "items.product",
          "name description quantity isRawMaterial unit"
        )
        .populate("supplier", "name contact address")
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.receivingNoteModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  async findOneReceivingNote(id: string): Promise<ReceivingNote> {
    const receivingNote = await this.receivingNoteModel
      .findById(id)
      .populate("items.product", "name description quantity isRawMaterial unit")
      .populate("supplier", "name contact address")
      .exec();

    if (!receivingNote) {
      throw new NotFoundException(`Receiving note with ID ${id} not found`);
    }

    return receivingNote;
  }
}
