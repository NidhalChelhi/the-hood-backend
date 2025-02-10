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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const receiving_note_dto_1 = require("./dto/receiving-note.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const update_product_dto_1 = require("./dto/update-product.dto");
const convert_raw_materials_dto_1 = require("./dto/convert-raw-materials.dto");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async findNormalProducts(page = 1, limit = 10, search) {
        return this.productsService.findNormalProducts(page, limit, search);
    }
    async findRawMaterials(page = 1, limit = 10, search) {
        return this.productsService.findRawMaterials(page, limit, search);
    }
    async create(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    async findAll(page = 1, limit = 10, search) {
        return this.productsService.findAll(page, limit, search);
    }
    async findOne(id) {
        return this.productsService.findOne(id);
    }
    async update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    async remove(id) {
        return this.productsService.remove(id);
    }
    async addQuantity(receivingNoteDto) {
        return this.productsService.addQuantity(receivingNoteDto);
    }
    async toggleStatus(id) {
        return this.productsService.toggleStatus(id);
    }
    async convertRawMaterials(convertRawMaterialsDto) {
        return this.productsService.convertRawMaterials(convertRawMaterialsDto);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)("normal"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findNormalProducts", null);
__decorate([
    (0, common_1.Get)("raw-materials"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findRawMaterials", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDTO]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDTO]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)("add-quantity"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [receiving_note_dto_1.ReceivingNoteDTO]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addQuantity", null);
__decorate([
    (0, common_1.Put)(":id/toggle-status"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "toggleStatus", null);
__decorate([
    (0, common_1.Post)("convert"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [convert_raw_materials_dto_1.ConvertRawMaterialsDTO]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "convertRawMaterials", null);
exports.ProductsController = ProductsController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)("products"),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map