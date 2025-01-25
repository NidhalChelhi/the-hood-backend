import { ProductAvailability } from "src/common/enums/product-availabilty.enum";
import {UserInfo} from "../users/types"
import {Order, ProductOrder, ProductOrderBatchesInfo} from "./orders.schema"

export type NamedProductOrder = Omit <ProductOrder, "productId"> & {
    productId : string;
}

export type OrderInfo = Omit<Order, "totalPrice" | "managerId" | "productOrders" | "originalProductOrders" > & {
    managerId : UserInfo;
    productOrders : NamedProductOrder[];
}
export type OriginalOrderInfo = Omit<Order, "totalPrice" | "managerId" | "productOrders" | "originalProductOrders" > & {
    managerId : UserInfo;
    originalProductOrders : NamedProductOrder[];
}

export type ProductOrderProcessingDetails = {
    productName : string,
    orderQuantity : number,
    totalQuantity : number,
    newQuantity : number,
    estimatedPrice : number;
    productStatus : ProductAvailability,
};
export type OrderDetails = {
    productDetails : ProductOrderProcessingDetails[];
    totalPrice : number;
}

export type ValidatedOrderInfo = {
    productsDetails : ProductOrderBatchesInfo[],
    totalPrice : number,
}