import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Product, SupplyBatch } from "./product.schema";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { CreateSupplyBatchDTO } from "./dto/create-supply-batch.dto";
import { NormalProductUsedBatch, PopulatedProduct } from "./types";
import { LocationRank } from "src/common/enums/location-rank.enum";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(SupplyBatch.name)
    private readonly supplyBatchModel: Model<SupplyBatch>
  ) {}

  async createProduct(createProductDTO: CreateProductDTO): Promise<Product> {
    try {
      const product = new this.productModel(createProductDTO);
      return await product.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Product with name '${createProductDTO.name}' already exists`
        );
      }
      this.logger.error("Error creating product:", error.message);
      throw new BadRequestException(
        `Failed to create product: ${error.message}`
      );
    }
  }

  async findAllProducts(): Promise<PopulatedProduct[]> {
    try {
      const products = await this.productModel
        .find()
        .populate<{ supplyBatchIds: SupplyBatch[] }>({
          path: "supplyBatchIds",
          model: "SupplyBatch",
        })
        .exec();

      return products as PopulatedProduct[];
    } catch (error) {
      this.logger.error("Error fetching products:", error.message);
      throw new BadRequestException(
        `Failed to fetch products: ${error.message}`
      );
    }
  }

  async findProductById(id: string): Promise<PopulatedProduct> {
    try {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidObjectId) {
        throw new BadRequestException("Invalid product ID provided.");
      }

      const product = await this.productModel
        .findById(id)
        .populate<{ supplyBatchIds: SupplyBatch[] }>({
          path: "supplyBatchIds",
          model: "SupplyBatch",
        })
        .exec();

      if (!product) {
        throw new NotFoundException("Product not found.");
      }

      return product as PopulatedProduct;
    } catch (error) {
      this.logger.error("Error fetching product:", error.message);
      throw new BadRequestException(
        `Failed to fetch product: ${error.message}`
      );
    }
  }

  async updateProduct(
    id: string,
    updateProductDTO: UpdateProductDTO
  ): Promise<Product> {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDTO,
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        throw new NotFoundException("Product not found");
      }

      return updatedProduct;
    } catch (error) {
      this.logger.error("Error updating product:", error.message);
      throw new BadRequestException(
        `Failed to update product: ${error.message}`
      );
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const product = await this.productModel.findById(id).exec();

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      await this.supplyBatchModel.deleteMany({ productId: product._id }).exec();
      await this.productModel.findByIdAndDelete(id).exec();
    } catch (error) {
      this.logger.error("Error deleting product:", error.message);
      throw new BadRequestException(
        `Failed to delete product: ${error.message}`
      );
    }
  }

  async getProductStock(productId: string): Promise<number> {
    try {
      const product = await this.findProductById(productId);
      Logger.log("Product fetched in getProductStock:", product);

      const totalStock = product.supplyBatchIds.reduce(
        (sum, batch) => sum + (batch.quantity || 0),
        0
      );

      Logger.log("Calculated totalStock:", totalStock);
      return totalStock;
    } catch (error) {
      this.logger.error("Error in getProductStock:", error.message);
      throw new BadRequestException(
        `Failed to calculate product stock: ${error.message}`
      );
    }
  }

  async getLowStockProducts(): Promise<Product[]> {
    try {
      return await this.productModel.find({ isBelowStockLimit: true }).exec();
    } catch (error) {
      this.logger.error("Error fetching low-stock products:", error.message);
      throw new BadRequestException(
        `Failed to fetch low-stock products: ${error.message}`
      );
    }
  }

  async createSupplyBatch(
    createSupplyBatchDTO: CreateSupplyBatchDTO
  ): Promise<SupplyBatch> {
    const { productId, ...batchData } = createSupplyBatchDTO;

    if (
      batchData.isFromRawMaterial &&
      (batchData.sellingPriceGold ||
        batchData.sellingPriceSilver ||
        batchData.sellingPriceBronze)
    ) {
      throw new BadRequestException(
        "Raw material batches cannot have selling prices."
      );
    }

    await this.findProductById(productId);

    const supplyBatch = new this.supplyBatchModel({
      productId,
      ...batchData,
    });

    const savedBatch = await supplyBatch.save();

    await this.productModel.findByIdAndUpdate(productId, {
      $push: { supplyBatchIds: savedBatch._id },
    });

    return savedBatch;
  }

  async retrieveStock(productId: string, quantity: number) {
    try {
      const totalStock = await this.getProductStock(productId);

      if (quantity > totalStock) {
        throw new BadRequestException(
          "Not enough stock available to fulfill the request."
        );
      }

      const product = await this.findProductById(productId);

      let remainingQuantity = quantity;
      const usedBatches = [];

      for (const batch of product.supplyBatchIds) {
        if (remainingQuantity <= 0) break;

        const usedQuantity = Math.min(batch.quantity, remainingQuantity);

        usedBatches.push({
          batchId: batch._id,
          quantityUsed: usedQuantity,
          purchasePrice: batch.purchasePrice,
        });

        const updatedBatch = await this.supplyBatchModel.findByIdAndUpdate(
          batch._id,
          { $inc: { quantity: -usedQuantity } },
          { new: true }
        );

        if (updatedBatch && updatedBatch.quantity <= 0) {
          await this.productModel.findByIdAndUpdate(productId, {
            $pull: { supplyBatchIds: updatedBatch._id },
          });
          await this.supplyBatchModel.findByIdAndDelete(updatedBatch._id);
        }

        remainingQuantity -= usedQuantity;
      }

      return { productName: product.name, usedBatches };
    } catch (error) {
      this.logger.error("Error in retrieveStock:", error.message);
      throw new BadRequestException(
        `Failed to retrieve stock: ${error.message}`
      );
    }
  }
  async retrieveNormalProductStock(productId: string, quantity: number, rank : LocationRank) : Promise<{productName : string, usedBatches : NormalProductUsedBatch[]}> {
    try {
      const totalStock = await this.getProductStock(productId);

      if (quantity > totalStock) {
        throw new BadRequestException(
          `Not enough stock available to fulfill the request. Product Id : ${productId}`
        );
      }

      const product = await this.findProductById(productId);

      let remainingQuantity = quantity;
      const usedBatches : NormalProductUsedBatch[] = [];

      for (const batch of product.supplyBatchIds) {
        if (remainingQuantity <= 0) break;

        const usedQuantity = Math.min(batch.quantity, remainingQuantity);

        usedBatches.push({
          batchId: batch._id.toString(),
          quantityUsed: usedQuantity,
          purchasePrice: batch.purchasePrice,
          sellingPrice : (rank == LocationRank.Gold)
              ? batch.sellingPriceGold
              : (rank == LocationRank.Silver)
                  ? batch.sellingPriceSilver
                  : batch.sellingPriceBronze,
        });

        const updatedBatch = await this.supplyBatchModel.findByIdAndUpdate(
          batch._id,
          { $inc: { quantity: -usedQuantity } },
          { new: true }
        );

        if (updatedBatch && updatedBatch.quantity <= 0) {
          await this.productModel.findByIdAndUpdate(productId, {
            $pull: { supplyBatchIds: updatedBatch._id },
          });
          await this.supplyBatchModel.findByIdAndDelete(updatedBatch._id);
        }

        remainingQuantity -= usedQuantity;
      }

      return { productName: product.name, usedBatches };
    } catch (error) {
      this.logger.error("Error in retrieveStock:", error.message);
      throw new BadRequestException(
        `Failed to retrieve stock: ${error.message}`
      );
    }
  }

  async findRawMaterials(): Promise<PopulatedProduct[]> {
    try {
      const rawMaterials = await this.productModel
        .find({ isRawMaterial: true })
        .populate<{ supplyBatchIds: SupplyBatch[] }>({
          path: "supplyBatchIds",
          model: "SupplyBatch",
        })
        .exec();

      return rawMaterials as PopulatedProduct[];
    } catch (error) {
      this.logger.error("Error fetching raw materials:", error.message);
      throw new BadRequestException(
        `Failed to fetch raw materials: ${error.message}`
      );
    }
  }

  async findNormalProducts(): Promise<PopulatedProduct[]> {
    try {
      const normalProducts = await this.productModel
        .find({ isRawMaterial: false })
        .populate<{ supplyBatchIds: SupplyBatch[] }>({
          path: "supplyBatchIds",
          model: "SupplyBatch",
        })
        .exec();

      return normalProducts as PopulatedProduct[];
    } catch (error) {
      this.logger.error("Error fetching normal products:", error.message);
      throw new BadRequestException(
        `Failed to fetch normal products: ${error.message}`
      );
    }
  }

  async convertRawMaterialsToProduct(
    rawMaterials: { productId: string; quantityUsed: number }[],
    producedProductId: string,
    producedQuantity: number,
    sellingPrices: { gold: number; silver: number; bronze: number }
  ): Promise<SupplyBatch> {
    try {
      if (producedQuantity <= 0) {
        throw new BadRequestException(
          "Produced quantity must be greater than zero."
        );
      }

      const productIds = rawMaterials.map((material) => material.productId);
      const duplicateIds = productIds.filter(
        (id, index) => productIds.indexOf(id) !== index
      );
      if (duplicateIds.length > 0) {
        throw new BadRequestException(
          `Duplicate entries detected for raw materials: ${[...new Set(duplicateIds)].join(", ")}`
        );
      }

      rawMaterials.forEach((material) => {
        if (material.quantityUsed <= 0) {
          throw new BadRequestException(
            `Invalid quantity for raw material with ID ${material.productId}. Quantity used must be greater than zero.`
          );
        }
      });

      const producedProduct = await this.findProductById(producedProductId);
      if (producedProduct.isRawMaterial) {
        throw new BadRequestException(
          `Cannot produce a raw material. Product ID ${producedProductId} is a raw material.`
        );
      }

      for (const material of rawMaterials) {
        const rawMaterial = await this.findProductById(material.productId);

        if (!rawMaterial.isRawMaterial) {
          throw new BadRequestException(
            `Product with ID ${material.productId} is not a raw material.`
          );
        }

        const availableStock = await this.getProductStock(material.productId);
        if (availableStock < material.quantityUsed) {
          throw new BadRequestException(
            `Not enough stock for raw material with ID ${material.productId}.`
          );
        }
      }

      let totalCost = 0;

      for (const material of rawMaterials) {
        const { usedBatches } = await this.retrieveStock(
          material.productId,
          material.quantityUsed
        );

        totalCost += usedBatches.reduce(
          (sum, batch) => sum + batch.quantityUsed * batch.purchasePrice,
          0
        );
      }

      const purchasePrice = totalCost / producedQuantity;

      const newSupplyBatch = new this.supplyBatchModel({
        productId: producedProductId,
        purchasePrice,
        sellingPriceGold: sellingPrices.gold,
        sellingPriceSilver: sellingPrices.silver,
        sellingPriceBronze: sellingPrices.bronze,
        quantity: producedQuantity,
        isFromRawMaterial: true,
      });

      const savedBatch = await newSupplyBatch.save();

      await this.productModel.findByIdAndUpdate(producedProductId, {
        $push: { supplyBatchIds: savedBatch._id },
      });

      return savedBatch;
    } catch (error) {
      this.logger.error("Error converting raw materials:", error.message);
      throw new BadRequestException(
        `Failed to convert raw materials: ${error.message}`
      );
    }
  }
}
