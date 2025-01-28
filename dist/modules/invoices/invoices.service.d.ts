import { Model } from 'mongoose';
import { Invoice } from './invoice.schema';
import { Order } from '../orders/orders.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UsersService } from '../users/users.service';
export declare class InvoicesService {
    private readonly invoiceModel;
    private readonly orderModel;
    private readonly userService;
    private readonly logger;
    constructor(invoiceModel: Model<Invoice>, orderModel: Model<Order>, userService: UsersService);
    create(createInvoiceDTO: CreateInvoiceDto): Promise<Invoice>;
    findByManagerName(managerName: string): Promise<Invoice[]>;
    findAll(): Promise<Invoice[]>;
    findOne(id: string): Promise<Invoice>;
    update(id: string, updateInvoiceDTO: UpdateInvoiceDto): Promise<Invoice>;
    remove(id: string): Promise<void>;
}
