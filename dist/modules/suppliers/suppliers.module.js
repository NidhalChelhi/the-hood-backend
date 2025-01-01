"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersModule = void 0;
const common_1 = require("@nestjs/common");
const suppliers_service_1 = require("./suppliers.service");
const suppliers_controller_1 = require("./suppliers.controller");
const mongoose_1 = require("@nestjs/mongoose");
const supplier_schema_1 = require("./supplier.schema");
let SuppliersModule = class SuppliersModule {
};
exports.SuppliersModule = SuppliersModule;
exports.SuppliersModule = SuppliersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: supplier_schema_1.Supplier.name, schema: supplier_schema_1.SupplierSchema },
            ]),
        ],
        providers: [suppliers_service_1.SuppliersService],
        controllers: [suppliers_controller_1.SuppliersController],
        exports: [suppliers_service_1.SuppliersService, mongoose_1.MongooseModule],
    })
], SuppliersModule);
//# sourceMappingURL=suppliers.module.js.map