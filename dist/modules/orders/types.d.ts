import { ProductAvailability } from "src/common/enums/product-availabilty.enum";
import { UserInfo } from "../users/types";
import { Order, ProductOrder } from "./orders.schema";
export type NamedProductOrder = Omit<ProductOrder, "productId"> & {
    productId: string;
};
export type OrderInfo = Omit<Order, "totalPrice" | "managerId" | "productOrders"> & {
    managerId: UserInfo;
    productOrders: NamedProductOrder[];
};
export type ProductOrderProcessingDetails = {
    productName: string;
    orderQuantity: number;
    totalQuantity: number;
    newQuantity: number;
    productStatus: ProductAvailability;
};
