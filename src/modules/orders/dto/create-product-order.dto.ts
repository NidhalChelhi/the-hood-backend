import {
    IsMongoId,
    IsNumber,
    IsNotEmpty,
    IsEnum,
} from "class-validator"
import { OrderStatus } from "src/common/enums/order-status.enum";
export class CreateProductOrderDTO {
    @IsMongoId()
    @IsNotEmpty()
    productId : string;

    @IsNumber()
    @IsNotEmpty()
    quantity : number;

    @IsEnum(Object.values(OrderStatus))
    status : OrderStatus = OrderStatus.Pending;
}
