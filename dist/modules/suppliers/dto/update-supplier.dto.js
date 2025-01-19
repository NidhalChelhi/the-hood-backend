"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSupplierDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_supplier_dto_1 = require("./create-supplier.dto");
class UpdateSupplierDTO extends (0, mapped_types_1.PartialType)(create_supplier_dto_1.CreateSupplierDTO) {
}
exports.UpdateSupplierDTO = UpdateSupplierDTO;
//# sourceMappingURL=update-supplier.dto.js.map