import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    create(createInvoiceDto: CreateInvoiceDto): Promise<import("./invoice.schema").Invoice>;
    findAll(): Promise<import("./invoice.schema").Invoice[]>;
    findByManagerName(id: string): Promise<import("./invoice.schema").Invoice[]>;
    findOne(id: string): Promise<import("./invoice.schema").Invoice>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<import("./invoice.schema").Invoice>;
    remove(id: string): Promise<void>;
}
