"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductOrderDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_product_order_dto_1 = require("./create-product-order.dto");
class UpdateProductOrderDTO extends (0, mapped_types_1.PartialType)(create_product_order_dto_1.CreateProductOrderDTO) {
}
exports.UpdateProductOrderDTO = UpdateProductOrderDTO;
//# sourceMappingURL=update-product-order.dto.js.map