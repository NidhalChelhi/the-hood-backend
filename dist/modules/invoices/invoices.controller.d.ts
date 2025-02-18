import { InvoicesService } from './invoices.service';
import { Invoice } from './invoice.schema';
import { CreateInvoiceDTO } from './dto/create-invoice.dto';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    createInvoice(createInvoiceDTO: CreateInvoiceDTO): Promise<import("mongoose").Document<unknown, {}, Invoice> & Invoice & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findUserInvoices(request: any, page?: number, limit?: number): Promise<{
        data: Invoice[];
        total: number;
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Invoice[];
        total: number;
    }>;
    getOrder(invoiceId: string): Promise<import("mongoose").Document<unknown, {}, Invoice> & Invoice & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
