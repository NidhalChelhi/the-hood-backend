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
exports.SuppliersController = void 0;
const common_1 = require("@nestjs/common");
const suppliers_service_1 = require("./suppliers.service");
const create_supplier_dto_1 = require("./dto/create-supplier.dto");
const update_supplier_dto_1 = require("./dto/update-supplier.dto");
const add_product_dto_1 = require("./dto/add-product.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let SuppliersController = class SuppliersController {
    constructor(suppliersService) {
        this.suppliersService = suppliersService;
    }
    async createSupplier(createSupplierDTO) {
        return this.suppliersService.createSupplier(createSupplierDTO);
    }
    async findAllSuppliers() {
        return this.suppliersService.findAllSuppliers();
    }
    async findSupplierById(id) {
        return this.suppliersService.findSupplierById(id);
    }
    async addProducts(id, addProductDTO) {
        return this.suppliersService.addProducts(id, addProductDTO.productNames);
    }
    async deleteProducts(id, deleteProductDTO) {
        return this.suppliersService.deleteProducts(id, deleteProductDTO.productNames);
    }
    async updateSupplier(id, updateSupplierDTO) {
        return this.suppliersService.updateSupplier(id, updateSupplierDTO);
    }
    async deleteSupplier(id) {
        await this.suppliersService.deleteSupplier(id);
        return { message: "Supplier deleted successfully" };
    }
};
exports.SuppliersController = SuppliersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_supplier_dto_1.CreateSupplierDTO]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "createSupplier", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findAllSuppliers", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findSupplierById", null);
__decorate([
    (0, common_1.Patch)(":id/add-products"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_product_dto_1.AddProductDTO]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "addProducts", null);
__decorate([
    (0, common_1.Patch)(":id/delete-products"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_product_dto_1.AddProductDTO]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "deleteProducts", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_supplier_dto_1.UpdateSupplierDTO]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "updateSupplier", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "deleteSupplier", null);
exports.SuppliersController = SuppliersController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('suppliers'),
    __metadata("design:paramtypes", [suppliers_service_1.SuppliersService])
], SuppliersController);
//# sourceMappingURL=suppliers.controller.js.map