import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DeliveryNote } from "./delivery-note.schema";
import { CreateDeliveryNoteDTO } from "./dto/create-delivery-note.dto";
import { User } from "../users/user.schema";
import { Order } from "../orders/order.schema";
import { DeliveryNoteStatus } from "src/common/enums/delivery-note-status";

@Injectable()
export class DeliveryNotesService {
  constructor(
    @InjectModel(DeliveryNote.name)
    private readonly deliveryNoteModel: Model<DeliveryNote>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>
  ) {}

  async createDeliveryNote(createDeliveryNoteDTO: CreateDeliveryNoteDTO) {
    const deliveryNote = new this.deliveryNoteModel(createDeliveryNoteDTO);
    await deliveryNote.save();
    return deliveryNote;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filter?: string
  ): Promise<{ data: DeliveryNote[]; total: number }> {
    const query: any = {};

    if (filter && filter !== "all") {
      query["status"] = filter;
    }

    if (search) {
      // Find users matching the search
      const matchingUsers = await this.userModel
        .find(
          {
            $or: [
              { username: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          },
          "_id"
        )
        .exec();

      const userIds = matchingUsers.map((user) => user._id);

      if (userIds.length > 0) {
        // Find orders where createdBy is in userIds
        const matchingOrders = await this.orderModel
          .find({ createdBy: { $in: userIds } }, "_id")
          .exec();

        const orderIds = matchingOrders.map((order) => order._id);

        if (orderIds.length > 0) {
          query["order"] = { $in: orderIds };
        } else {
          return { data: [], total: 0 }; // No orders found for these users
        }
      } else {
        return { data: [], total: 0 }; // No users found
      }
    }

    const [data, total] = await Promise.all([
      this.deliveryNoteModel
        .find(query)
        .populate({
          path: "order",
          populate: [
            {
              path: "createdBy",
              model: "User",
              select: "_id username email phoneNumber location",
            },
            {
              path: "orderItems.product",
              model: "Product",
            },
            {
              path: "originalOrderItems.product",
              model: "Product",
            },
          ],
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.deliveryNoteModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  async findOne(deliveryNoteId: string) {
    const deliveryNote = this.deliveryNoteModel
      .findById(deliveryNoteId)
      .populate({
        path: "order",
        populate: {
          path: "createdBy",
          model: "User",
          select: "_id username email phoneNumber location",
        },
      })
      .populate({
        path: "order",
        populate: {
          path: "orderItems.product",
          model: "Product",
        },
      })
      .populate({
        path: "order",
        populate: {
          path: "originalOrderItems.product",
          model: "Product",
        },
      })
      .exec();

    if (!deliveryNote) {
      throw new NotFoundException(
        `Delivery note with ID ${deliveryNoteId} not found`
      );
    }

    return deliveryNote;
  }
  async findPending(){
    return await this.deliveryNoteModel.find({status : DeliveryNoteStatus.PENDING})
      .populate({
        path: "order",
        populate: {
          path: "createdBy",
          model: "User",
          select: "_id username email phoneNumber location",
        },
      })
      .populate({
        path: "order",
        populate: {
          path: "orderItems.product",
          model: "Product",
        },
      })
      .populate({
        path: "order",
        populate: {
          path: "originalOrderItems.product",
          model: "Product",
        },
      })
      .exec();
  }
  async findOneByOrderId(orderId : string){
    return await this.deliveryNoteModel.findOne({order : new Types.ObjectId(orderId)})
  }
  async findManyByOrderIds(ordersId : string[]){
    return await this.deliveryNoteModel.find({order : { $in : ordersId.map((elem) => new Types.ObjectId(elem))}});
  }
}
