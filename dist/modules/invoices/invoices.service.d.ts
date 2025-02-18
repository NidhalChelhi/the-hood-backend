import { Invoice } from './invoice.schema';
import { Model } from 'mongoose';
import { CreateInvoiceDTO } from './dto/create-invoice.dto';
import { OrdersService } from '../orders/orders.service';
import { User } from '../users/user.schema';
import { DeliveryNotesService } from '../delivery-notes/delivery-notes.service';
export declare class InvoicesService {
    private readonly invoiceModel;
    private readonly userModel;
    private readonly orderService;
    private readonly deliveryNoteService;
    constructor(invoiceModel: Model<Invoice>, userModel: Model<User>, orderService: OrdersService, deliveryNoteService: DeliveryNotesService);
    findOne(invoiceId: string): Promise<import("mongoose").Document<unknown, {}, Invoice> & Invoice & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Invoice[];
        total: number;
    }>;
    createInvoice(createInvoiceDTO: CreateInvoiceDTO): Promise<import("mongoose").Document<unknown, {}, Invoice> & Invoice & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
