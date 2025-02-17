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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./product.schema");
const receiving_note_schema_1 = require("./receiving-note.schema");
const supplier_schema_1 = require("../suppliers/supplier.schema");
let ProductsService = class ProductsService {
    constructor(productModel, receivingNoteModel, supplierModel) {
        this.productModel = productModel;
        this.receivingNoteModel = receivingNoteModel;
        this.supplierModel = supplierModel;
    }
    async create(createProductDto) {
        const createdProduct = new this.productModel(createProductDto);
        return createdProduct.save();
    }
    async findAll(page = 1, limit = 10, search, filter) {
        const query = {};
        if (filter) {
            if (filter === "normal") {
                query.isRawMaterial = false;
            }
            else if (filter === "raw") {
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
    async findAllUnpaginated() {
        return await this.productModel.find().exec();
    }
    async findOne(id) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(id, updateProductDto, { new: true })
            .exec();
        if (!updatedProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return updatedProduct;
    }
    async remove(id) {
        const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
        if (!deletedProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return deletedProduct;
    }
    async addQuantity(receivingNoteDto) {
        const { productId, quantityAdded, purchasePrice, sellingPriceGold, sellingPriceSilver, sellingPriceBronze, supplier, } = receivingNoteDto;
        const product = await this.productModel.findById(productId).exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        const totalQuantity = product.quantity + quantityAdded;
        const totalPurchasePrice = product.purchasePrice * product.quantity + purchasePrice * quantityAdded;
        product.purchasePrice = totalPurchasePrice / totalQuantity;
        if (!product.isRawMaterial) {
            if (sellingPriceGold !== undefined) {
                const totalSellingPriceGold = (product.sellingPriceGold || 0) * product.quantity +
                    sellingPriceGold * quantityAdded;
                product.sellingPriceGold = totalSellingPriceGold / totalQuantity;
            }
            if (sellingPriceSilver !== undefined) {
                const totalSellingPriceSilver = (product.sellingPriceSilver || 0) * product.quantity +
                    sellingPriceSilver * quantityAdded;
                product.sellingPriceSilver = totalSellingPriceSilver / totalQuantity;
            }
            if (sellingPriceBronze !== undefined) {
                const totalSellingPriceBronze = (product.sellingPriceBronze || 0) * product.quantity +
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
    async toggleStatus(id) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        product.isActive = !product.isActive;
        await product.save();
        return product;
    }
    async convertRawMaterials(convertRawMaterialsDto) {
        const { rawMaterials, finishedProductId, quantityProduced, sellingPriceGold, sellingPriceSilver, sellingPriceBronze, } = convertRawMaterialsDto;
        for (const rawMaterial of rawMaterials) {
            const { rawMaterialId, quantityUsed } = rawMaterial;
            const rawMaterialProduct = await this.productModel
                .findById(rawMaterialId)
                .exec();
            if (!rawMaterialProduct) {
                throw new common_1.NotFoundException(`Raw material with ID ${rawMaterialId} not found`);
            }
            if (rawMaterialProduct.quantity < quantityUsed) {
                throw new Error(`Insufficient quantity for raw material ${rawMaterialProduct.name}`);
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
            throw new common_1.NotFoundException(`Finished product with ID ${finishedProductId} not found`);
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
    async updateProductStock(orderItems) {
        for (const item of orderItems) {
            const product = await this.productModel.findById(item.product).exec();
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.product} not found`);
            }
            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }
            product.quantity -= item.quantity;
            await product.save();
        }
    }
    async addQuantities(receivingNoteMultipleDto) {
        const { items, supplier } = receivingNoteMultipleDto;
        const updatedProducts = [];
        for (const productData of items) {
            const { productId, quantityAdded, purchasePrice, sellingPriceGold, sellingPriceSilver, sellingPriceBronze, } = productData;
            const product = await this.productModel.findById(productId).exec();
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
            }
            const totalQuantity = product.quantity + quantityAdded;
            const totalPurchasePrice = product.purchasePrice * product.quantity +
                purchasePrice * quantityAdded;
            product.purchasePrice = totalPurchasePrice / totalQuantity;
            if (!product.isRawMaterial) {
                if (sellingPriceGold !== undefined) {
                    const totalSellingPriceGold = (product.sellingPriceGold || 0) * product.quantity +
                        sellingPriceGold * quantityAdded;
                    product.sellingPriceGold = totalSellingPriceGold / totalQuantity;
                }
                if (sellingPriceSilver !== undefined) {
                    const totalSellingPriceSilver = (product.sellingPriceSilver || 0) * product.quantity +
                        sellingPriceSilver * quantityAdded;
                    product.sellingPriceSilver = totalSellingPriceSilver / totalQuantity;
                }
                if (sellingPriceBronze !== undefined) {
                    const totalSellingPriceBronze = (product.sellingPriceBronze || 0) * product.quantity +
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
    async editQuantity(editQuantityDto) {
        const { productId, quantityChange } = editQuantityDto;
        const product = await this.productModel.findById(productId).exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        const newQuantity = product.quantity + quantityChange;
        if (newQuantity < 0) {
            throw new common_1.BadRequestException("Quantity cannot be negative");
        }
        product.quantity = newQuantity;
        product.isBelowStockLimit = product.quantity <= product.stockLimit;
        product.isActive = product.quantity > 0;
        await product.save();
        return product;
    }
    async findAllReceivingNotes(page = 1, limit = 10, search) {
        const query = {};
        if (search) {
            const matchingProducts = await this.productModel
                .find({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ],
            }, "_id")
                .exec();
            const matchingSuppliers = await this.supplierModel
                .find({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { contact: { $regex: search, $options: "i" } },
                    { address: { $regex: search, $options: "i" } },
                ],
            }, "_id")
                .exec();
            const productIds = matchingProducts.map((product) => product._id);
            const suppliers = matchingSuppliers.map((supplier) => supplier._id);
            if (productIds.length > 0 || suppliers.length > 0) {
                query.$or = [
                    { "items.product": { $in: productIds } },
                    { supplier: { $in: suppliers } },
                ];
            }
            else {
                return { data: [], total: 0 };
            }
        }
        const [data, total] = await Promise.all([
            this.receivingNoteModel
                .find(query)
                .populate("items.product", "name description quantity isRawMaterial unit")
                .populate("supplier", "name contact address")
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.receivingNoteModel.countDocuments(query).exec(),
        ]);
        return { data, total };
    }
    async findOneReceivingNote(id) {
        const receivingNote = await this.receivingNoteModel
            .findById(id)
            .populate("items.product", "name description quantity isRawMaterial unit")
            .populate("supplier", "name contact address")
            .exec();
        if (!receivingNote) {
            throw new common_1.NotFoundException(`Receiving note with ID ${id} not found`);
        }
        return receivingNote;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(receiving_note_schema_1.ReceivingNote.name)),
    __param(2, (0, mongoose_1.InjectModel)(supplier_schema_1.Supplier.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map