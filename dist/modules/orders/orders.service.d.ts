import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersService {
    create(createOrderDto: CreateOrderDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateOrderDto: UpdateOrderDto): string;
    remove(id: number): string;
}
