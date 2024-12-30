import { PartialType } from "@nestjs/mapped-types";
import { CreateSupplierDTO } from "./create-supplier.dto";

export class UpdateSupplierDTO extends PartialType(CreateSupplierDTO) {}
