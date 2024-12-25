import { PartialType } from "@nestjs/mapped-types";
import { CreateProductOrderDTO } from "./create-product-order.dto";

export class UpdateProductOrderDTO extends PartialType(CreateProductOrderDTO){}
