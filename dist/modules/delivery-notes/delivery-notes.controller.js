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
exports.DeliveryNotesController = void 0;
const common_1 = require("@nestjs/common");
const delivery_notes_service_1 = require("./delivery-notes.service");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let DeliveryNotesController = class DeliveryNotesController {
    constructor(deliveryNotesService) {
        this.deliveryNotesService = deliveryNotesService;
    }
    async findAll(page = 1, limit = 10, search, filter) {
        return this.deliveryNotesService.findAll(page, limit, search, filter);
    }
    async findOne(orderId) {
        const deliveryNote = await this.deliveryNotesService.findOne(orderId);
        if (!deliveryNote) {
            throw new common_1.NotFoundException(`Delivery note with ID ${orderId} not found`);
        }
        return deliveryNote;
    }
};
exports.DeliveryNotesController = DeliveryNotesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __param(3, (0, common_1.Query)("filter")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], DeliveryNotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryNotesController.prototype, "findOne", null);
exports.DeliveryNotesController = DeliveryNotesController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)("delivery-notes"),
    __metadata("design:paramtypes", [delivery_notes_service_1.DeliveryNotesService])
], DeliveryNotesController);
//# sourceMappingURL=delivery-notes.controller.js.map