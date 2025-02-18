import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './invoice.schema';
import { Model, Types } from 'mongoose';
import { CreateInvoiceDTO } from './dto/create-invoice.dto';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { User } from '../users/user.schema';
import { DeliveryNotesService } from '../delivery-notes/delivery-notes.service';
import { DeliveryNoteStatus } from 'src/common/enums/delivery-note-status';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel : Model<Invoice>,
    @InjectModel(User.name) private readonly userModel : Model<User>,
    private readonly orderService : OrdersService,
    private readonly deliveryNoteService : DeliveryNotesService,
  ){}

  async findOne(invoiceId : string){
    return await this.invoiceModel.findById(invoiceId)
      .populate("createdFor", "_id username email phoneNumber location")
      .populate(
        "items.product",
        "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze"
      )
      .populate(
        "orders",
        "_id processedAt modifiedAt"
      )
      .populate(
        "createdFor",
        "_id username email phoneNumber location"
      )
      .exec()
  }
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: Invoice[]; total: number }> {
    const query: any = {};

    // If there's a search term, find matching users first
    if (search) {
      const matchingUsers = await this.userModel
        .find(
          {
            $or: [
              { username: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          },
          "_id" // Only return the IDs
        )
        .exec();

      const userIds = matchingUsers.map((user) => user._id);

      if (userIds.length > 0) {
        query["createdFor"] = { $in: userIds };
      } else {
        return { data: [], total: 0 }; // No matching users means no matching orders
      }
    }

    const [data, total] = await Promise.all([
      this.invoiceModel
        .find(query)
        .populate("createdFor", "_id username email phoneNumber location")
        .populate(
          "items.product",
          "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze"
        )
        .populate(
          "orders",
          "_id processedAt modifiedAt"
        )
        .populate(
          "createdFor",
          "_id username email phoneNumber location"
        )
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.invoiceModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }
  async createInvoice(createInvoiceDTO : CreateInvoiceDTO){
    try{
      const orders = await this.orderService.findMultiple(createInvoiceDTO.orders);
      const statusCheck = orders.every((order) => order.status === OrderStatus.ACCEPTED);
      const userCheck = orders.every((order) => order.createdBy.toString() === createInvoiceDTO.createdFor);
      if(!userCheck || !statusCheck){
        if(!statusCheck){
          throw new Error("Non Accepted Orders");

        }else{
          throw new Error("User not the same for all orders");
        }
      }
      const totalPrice = orders.reduce((acc, order) => {
        return acc + order.orderItems.reduce((itemAcc, item) => itemAcc + item.quantity * item.price, 0)
      }, 0);
      const items = orders.map((order) => order.orderItems).flat();
      const deliveryNotes =await this.deliveryNoteService.findManyByOrderIds(createInvoiceDTO.orders);
      if (deliveryNotes.some((note) => {
        return note.status === DeliveryNoteStatus.INVOICED
      }
      )){
        throw new Error("Orders already invoiced");
      }
      await Promise.all(deliveryNotes.map(async (note) => {
        note.status = DeliveryNoteStatus.INVOICED;
        return await note.save();
      }))
      const invoice = new this.invoiceModel({
        createdFor : new Types.ObjectId(createInvoiceDTO.createdFor),
        orders : createInvoiceDTO.orders.map((orderId) => new Types.ObjectId(orderId)),
        items,
        totalPrice
      });
      return await invoice.save();
    }catch(error){
      throw new BadRequestException("Unable to create invoice ", error.message);
    }
  }
}
