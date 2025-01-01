"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_product_dto_1 = require("./create-product.dto");
class UpdateProductDTO extends (0, mapped_types_1.PartialType)(create_product_dto_1.CreateProductDTO) {
}
exports.UpdateProductDTO = UpdateProductDTO;
//# sourceMappingURL=update-product.dto.js.map