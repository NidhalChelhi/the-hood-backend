import { DeliveryNotesService } from "./delivery-notes.service";
import { DeliveryNote } from "./delivery-note.schema";
export declare class DeliveryNotesController {
    private readonly deliveryNotesService;
    constructor(deliveryNotesService: DeliveryNotesService);
    findOwn(request: any, page?: number, limit?: number, filter?: string): Promise<{
        data: DeliveryNote[];
        total: number;
    }>;
    findAll(page?: number, limit?: number, search?: string, filter?: string): Promise<{
        data: DeliveryNote[];
        total: number;
    }>;
    findOne(orderId: string): Promise<import("mongoose").Document<unknown, {}, DeliveryNote> & DeliveryNote & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
