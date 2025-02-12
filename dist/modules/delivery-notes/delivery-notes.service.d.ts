import { Model } from "mongoose";
import { DeliveryNote } from "./delivery-note.schema";
import { CreateDeliveryNoteDTO } from "./dto/create-delivery-note.dto";
import { User } from "../users/user.schema";
import { Order } from "../orders/order.schema";
export declare class DeliveryNotesService {
    private readonly deliveryNoteModel;
    private readonly userModel;
    private readonly orderModel;
    constructor(deliveryNoteModel: Model<DeliveryNote>, userModel: Model<User>, orderModel: Model<Order>);
    createDeliveryNote(createDeliveryNoteDTO: CreateDeliveryNoteDTO): Promise<import("mongoose").Document<unknown, {}, DeliveryNote> & DeliveryNote & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(page?: number, limit?: number, search?: string, filter?: string): Promise<{
        data: DeliveryNote[];
        total: number;
    }>;
    findOne(deliveryNoteId: string): Promise<import("mongoose").Document<unknown, {}, DeliveryNote> & DeliveryNote & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
