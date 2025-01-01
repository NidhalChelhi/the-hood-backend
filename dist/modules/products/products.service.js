"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./product.schema");
const location_rank_enum_1 = require("../../common/enums/location-rank.enum");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor(productModel, supplyBatchModel) {
        this.productModel = productModel;
        this.supplyBatchModel = supplyBatchModel;
        this.logger = new common_1.Logger(ProductsService_1.name);
    }
    async createProduct(createProductDTO) {
        try {
            const product = new this.productModel(createProductDTO);
            return await product.save();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException(`Product with name '${createProductDTO.name}' already exists`);
            }
            this.logger.error("Error creating product:", error.message);
            throw new common_1.BadRequestException(`Failed to create product: ${error.message}`);
        }
    }
    async findAllProducts() {
        try {
            const products = await this.productModel
                .find()
                .populate({
                path: "supplyBatchIds",
                model: "SupplyBatch",
            })
                .exec();
            return products;
        }
        catch (error) {
            this.logger.error("Error fetching products:", error.message);
            throw new common_1.BadRequestException(`Failed to fetch products: ${error.message}`);
        }
    }
    async findProductById(id) {
        try {
            const isValidObjectId = mongoose_2.default.Types.ObjectId.isValid(id);
            if (!isValidObjectId) {
                throw new common_1.BadRequestException(`Invalid product ID provided : ${id}`);
            }
            const product = await this.productModel
                .findById(id)
                .populate({
                path: "supplyBatchIds",
                model: "SupplyBatch",
            })
                .exec();
            if (!product) {
                throw new common_1.NotFoundException("Product not found.");
            }
            return product;
        }
        catch (error) {
            this.logger.error("Error fetching product:", error.message);
            throw new common_1.BadRequestException(`Failed to fetch product: ${error.message}`);
        }
    }
    async updateProduct(id, updateProductDTO) {
        try {
            const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDTO, { new: true, runValidators: true });
            if (!updatedProduct) {
                throw new common_1.NotFoundException("Product not found");
            }
            return updatedProduct;
        }
        catch (error) {
            this.logger.error("Error updating product:", error.message);
            throw new common_1.BadRequestException(`Failed to update product: ${error.message}`);
        }
    }
    async deleteProduct(id) {
        try {
            const product = await this.productModel.findById(id).exec();
            if (!product) {
                throw new common_1.NotFoundException("Product not found");
            }
            await this.supplyBatchModel.deleteMany({ productId: product._id }).exec();
            await this.productModel.findByIdAndDelete(id).exec();
        }
        catch (error) {
            this.logger.error("Error deleting product:", error.message);
            throw new common_1.BadRequestException(`Failed to delete product: ${error.message}`);
        }
    }
    async getProductStock(productId) {
        try {
            const product = await this.findProductById(productId);
            common_1.Logger.log("Product fetched in getProductStock:", product);
            const totalStock = product.supplyBatchIds.reduce((sum, batch) => sum + (batch.quantity || 0), 0);
            common_1.Logger.log("Calculated totalStock:", totalStock);
            return totalStock;
        }
        catch (error) {
            this.logger.error("Error in getProductStock:", error.message);
            throw new common_1.BadRequestException(`Failed to calculate product stock: ${error.message}`);
        }
    }
    async getProductAveragePrice(productId) {
        try {
            const product = await this.findProductById(productId);
            common_1.Logger.log("Product fetched in getProductStock:", product);
            const totalPrices = product.supplyBatchIds.reduce((sum, batch) => {
                return {
                    totalQuantity: sum.totalQuantity + batch.quantity || 0,
                    totalPurchasePrice: sum.totalPurchasePrice + (batch.purchasePrice * (batch.quantity || 0)),
                    totalSellingPriceGold: sum.totalSellingPriceGold + (batch.sellingPriceGold || 0) * (batch.quantity || 0),
                    totalSellingPriceSilver: sum.totalSellingPriceSilver + (batch.sellingPriceSilver || 0) * (batch.quantity || 0),
                    totalSellingPriceBronze: sum.totalSellingPriceBronze + (batch.sellingPriceBronze || 0) * (batch.quantity || 0)
                };
            }, {
                totalQuantity: 0,
                totalPurchasePrice: 0,
                totalSellingPriceGold: 0,
                totalSellingPriceSilver: 0,
                totalSellingPriceBronze: 0,
            });
            return {
                ...totalPrices,
                averagePurchasePrice: totalPrices.totalPurchasePrice / totalPrices.totalQuantity,
                averageSellingPriceGold: totalPrices.totalSellingPriceGold / totalPrices.totalQuantity,
                averageSellingPriceSilver: totalPrices.totalSellingPriceSilver / totalPrices.totalQuantity,
                averageSellingPriceBronze: totalPrices.totalSellingPriceBronze / totalPrices.totalQuantity,
            };
        }
        catch (error) {
            this.logger.error("Error in getProductStock:", error.message);
            throw new common_1.BadRequestException(`Failed to calculate product stock: ${error.message}`);
        }
    }
    async getLowStockProducts() {
        try {
            return await this.productModel.find({ isBelowStockLimit: true }).exec();
        }
        catch (error) {
            this.logger.error("Error fetching low-stock products:", error.message);
            throw new common_1.BadRequestException(`Failed to fetch low-stock products: ${error.message}`);
        }
    }
    async createSupplyBatch(createSupplyBatchDTO) {
        const { productId, ...batchData } = createSupplyBatchDTO;
        if (batchData.isFromRawMaterial &&
            (batchData.sellingPriceGold ||
                batchData.sellingPriceSilver ||
                batchData.sellingPriceBronze)) {
            throw new common_1.BadRequestException("Raw material batches cannot have selling prices.");
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
    async retrieveStock(productId, quantity) {
        try {
            const totalStock = await this.getProductStock(productId);
            if (quantity > totalStock) {
                throw new common_1.BadRequestException("Not enough stock available to fulfill the request.");
            }
            const product = await this.findProductById(productId);
            let remainingQuantity = quantity;
            const usedBatches = [];
            for (const batch of product.supplyBatchIds) {
                if (remainingQuantity <= 0)
                    break;
                const usedQuantity = Math.min(batch.quantity, remainingQuantity);
                usedBatches.push({
                    batchId: batch._id,
                    quantityUsed: usedQuantity,
                    purchasePrice: batch.purchasePrice,
                });
                const updatedBatch = await this.supplyBatchModel.findByIdAndUpdate(batch._id, { $inc: { quantity: -usedQuantity } }, { new: true });
                if (updatedBatch && updatedBatch.quantity <= 0) {
                    await this.productModel.findByIdAndUpdate(productId, {
                        $pull: { supplyBatchIds: updatedBatch._id },
                    });
                    await this.supplyBatchModel.findByIdAndDelete(updatedBatch._id);
                }
                remainingQuantity -= usedQuantity;
            }
            return { productName: product.name, usedBatches };
        }
        catch (error) {
            this.logger.error("Error in retrieveStock:", error.message);
            throw new common_1.BadRequestException(`Failed to retrieve stock: ${error.message}`);
        }
    }
    async retrieveNormalProductStock(productId, quantity, rank) {
        try {
            const totalStock = await this.getProductStock(productId);
            if (quantity > totalStock) {
                throw new common_1.BadRequestException(`Not enough stock available to fulfill the request. Product Id : ${productId}`);
            }
            const product = await this.findProductById(productId);
            let remainingQuantity = quantity;
            const usedBatches = [];
            for (const batch of product.supplyBatchIds) {
                if (remainingQuantity <= 0)
                    break;
                const usedQuantity = Math.min(batch.quantity, remainingQuantity);
                usedBatches.push({
                    batchId: batch._id.toString(),
                    quantityUsed: usedQuantity,
                    purchasePrice: batch.purchasePrice,
                    sellingPrice: (rank == location_rank_enum_1.LocationRank.Gold)
                        ? batch.sellingPriceGold
                        : (rank == location_rank_enum_1.LocationRank.Silver)
                            ? batch.sellingPriceSilver
                            : batch.sellingPriceBronze,
                });
                const updatedBatch = await this.supplyBatchModel.findByIdAndUpdate(batch._id, { $inc: { quantity: -usedQuantity } }, { new: true });
                if (updatedBatch && updatedBatch.quantity <= 0) {
                    await this.productModel.findByIdAndUpdate(productId, {
                        $pull: { supplyBatchIds: updatedBatch._id },
                    });
                    await this.supplyBatchModel.findByIdAndDelete(updatedBatch._id);
                }
                remainingQuantity -= usedQuantity;
            }
            return { productName: product.name, usedBatches };
        }
        catch (error) {
            this.logger.error("Error in retrieveStock:", error.message);
            throw new common_1.BadRequestException(`Failed to retrieve stock: ${error.message}`);
        }
    }
    async findRawMaterials() {
        try {
            const rawMaterials = await this.productModel
                .find({ isRawMaterial: true })
                .populate({
                path: "supplyBatchIds",
                model: "SupplyBatch",
            })
                .exec();
            return rawMaterials;
        }
        catch (error) {
            this.logger.error("Error fetching raw materials:", error.message);
            throw new common_1.BadRequestException(`Failed to fetch raw materials: ${error.message}`);
        }
    }
    async findNormalProducts() {
        try {
            const normalProducts = await this.productModel
                .find({ isRawMaterial: false })
                .populate({
                path: "supplyBatchIds",
                model: "SupplyBatch",
            })
                .exec();
            return normalProducts;
        }
        catch (error) {
            this.logger.error("Error fetching normal products:", error.message);
            throw new common_1.BadRequestException(`Failed to fetch normal products: ${error.message}`);
        }
    }
    async convertRawMaterialsToProduct(rawMaterials, producedProductId, producedQuantity, sellingPrices) {
        try {
            if (producedQuantity <= 0) {
                throw new common_1.BadRequestException("Produced quantity must be greater than zero.");
            }
            const productIds = rawMaterials.map((material) => material.productId);
            const duplicateIds = productIds.filter((id, index) => productIds.indexOf(id) !== index);
            if (duplicateIds.length > 0) {
                throw new common_1.BadRequestException(`Duplicate entries detected for raw materials: ${[...new Set(duplicateIds)].join(", ")}`);
            }
            rawMaterials.forEach((material) => {
                if (material.quantityUsed <= 0) {
                    throw new common_1.BadRequestException(`Invalid quantity for raw material with ID ${material.productId}. Quantity used must be greater than zero.`);
                }
            });
            const producedProduct = await this.findProductById(producedProductId);
            if (producedProduct.isRawMaterial) {
                throw new common_1.BadRequestException(`Cannot produce a raw material. Product ID ${producedProductId} is a raw material.`);
            }
            for (const material of rawMaterials) {
                const rawMaterial = await this.findProductById(material.productId);
                if (!rawMaterial.isRawMaterial) {
                    throw new common_1.BadRequestException(`Product with ID ${material.productId} is not a raw material.`);
                }
                const availableStock = await this.getProductStock(material.productId);
                if (availableStock < material.quantityUsed) {
                    throw new common_1.BadRequestException(`Not enough stock for raw material with ID ${material.productId}.`);
                }
            }
            let totalCost = 0;
            for (const material of rawMaterials) {
                const { usedBatches } = await this.retrieveStock(material.productId, material.quantityUsed);
                totalCost += usedBatches.reduce((sum, batch) => sum + batch.quantityUsed * batch.purchasePrice, 0);
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
        }
        catch (error) {
            this.logger.error("Error converting raw materials:", error.message);
            throw new common_1.BadRequestException(`Failed to convert raw materials: ${error.message}`);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.SupplyBatch.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map