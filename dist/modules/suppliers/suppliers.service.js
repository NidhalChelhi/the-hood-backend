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
var SuppliersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const supplier_schema_1 = require("./supplier.schema");
const mongoose_2 = require("mongoose");
let SuppliersService = SuppliersService_1 = class SuppliersService {
    constructor(supplierModel) {
        this.supplierModel = supplierModel;
        this.logger = new common_1.Logger(SuppliersService_1.name);
    }
    async createSupplier(createSupplierDTO) {
        try {
            const supplier = new this.supplierModel(createSupplierDTO);
            return await supplier.save();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException(`Supplier with name '${createSupplierDTO.name}' already exists`);
            }
            this.logger.error("Error creating supplier:", error.message);
            throw new common_1.BadRequestException(`Failed to create supplier: ${error.message}`);
        }
    }
    async findAllSuppliers(page = 1, limit = 10, search) {
        const query = search ? { name: { $regex: search, $options: "i" } } : {};
        const [data, total] = await Promise.all([
            this.supplierModel
                .find(query)
                .populate("purchasedProducts.product", "_id name unit")
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.supplierModel.countDocuments(query).exec(),
        ]);
        return { data, total };
    }
    async findSupplierById(id) {
        const isValidObjectId = mongoose_2.default.Types.ObjectId.isValid(id);
        if (!isValidObjectId) {
            throw new common_1.BadRequestException(`Invalid supplier ID provided : ${id}`);
        }
        try {
            const supplier = await this.supplierModel.findById(id)
                .populate("purchasedProducts.product", "_id name unit");
            if (!supplier) {
                throw new common_1.BadRequestException(`Supplier with id ${id} not found`);
            }
            return supplier;
        }
        catch (error) {
            this.logger.error("Error fetching suppliers : ", error.message);
            throw new common_1.BadRequestException(`Failed to fetch suppliers : ${error.message}`);
        }
    }
    async updateSupplier(id, updateSupplierDTO) {
        const isValidObjectId = mongoose_2.default.Types.ObjectId.isValid(id);
        if (!isValidObjectId) {
            throw new common_1.BadRequestException(`Invalid supplier ID provided : ${id}`);
        }
        try {
            const supplier = await this.supplierModel.findByIdAndUpdate(id, updateSupplierDTO, { new: true, runValidators: true });
            if (!supplier) {
                throw new common_1.BadRequestException(`Supplier with id ${id} not found`);
            }
            return supplier;
        }
        catch (error) {
            this.logger.error("Error updating suppliers : ", error.message);
            throw new common_1.BadRequestException(`Failed to update suppliers : ${error.message}`);
        }
    }
    async deleteSupplier(id) {
        const isValidObjectId = mongoose_2.default.Types.ObjectId.isValid(id);
        if (!isValidObjectId) {
            throw new common_1.BadRequestException(`Invalid supplier ID provided : ${id}`);
        }
        try {
            const supplier = await this.supplierModel.findByIdAndDelete(id);
            if (!supplier) {
                throw new common_1.BadRequestException(`Supplier with id ${id} not found`);
            }
        }
        catch (error) {
            this.logger.error("Error deleting suppliers : ", error.message);
            throw new common_1.BadRequestException(`Failed to delete suppliers : ${error.message}`);
        }
    }
    async addProucts(products, supplierId) {
        try {
            const supplier = await this.supplierModel.findById(supplierId);
            supplier.purchasedProducts = this.fixCumulation(supplier.purchasedProducts);
            products.forEach((product) => {
                const existingProduct = supplier.purchasedProducts.find((item) => item.product.toString() === product.productId);
                if (!existingProduct) {
                    supplier.purchasedProducts.push({
                        product: new mongoose_2.Types.ObjectId(product.productId),
                        price: product.purchasePrice,
                        quantity: product.quantity,
                    });
                }
                else {
                    const newPrice = (product.purchasePrice * product.quantity + existingProduct.price * existingProduct.quantity) / (product.quantity + existingProduct.quantity);
                    existingProduct.price = newPrice;
                    existingProduct.quantity += product.quantity;
                }
            });
            return await supplier.save();
        }
        catch (error) {
            this.logger.error("Error adding products: ", error.message);
            throw new common_1.BadRequestException(`Failed to add products : ${error.message}`);
        }
    }
    fixCumulation(products) {
        return Object.values(products.reduce((acc, item) => {
            if (!acc[item.product.toString()]) {
                acc[item.product.toString()] = {
                    product: item.product,
                    price: item.price,
                    quantity: item.quantity
                };
            }
            else {
                const newPrice = (item.price * item.quantity + acc[item.product.toString()].price * acc[item.product.toString()].quantity) / (item.quantity + acc[item.product.toString()].quantity);
                acc[item.product.toString()].price = newPrice;
                acc[item.product.toString()].quantity += item.quantity;
            }
            return acc;
        }, {}));
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = SuppliersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(supplier_schema_1.Supplier.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map