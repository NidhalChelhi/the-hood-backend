import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Order } from "./order.schema";
import { ProductsService } from "../products/products.service";
import { OrderStatus } from "src/common/enums/order-status.enum";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { UpdateOrderDTO } from "./dto/update-order.dto";
import { DeliveryNotesService } from "../delivery-notes/delivery-notes.service";
import { UsersService } from "../users/users.service";
import { LocationRank } from "src/common/enums/location-rank.enum";
import { User } from "../users/user.schema";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly deliveryNoteService: DeliveryNotesService,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filter?: string
  ): Promise<{ data: Order[]; total: number }> {
    const query: any = {};

    if (filter && filter !== "all") {
      query["status"] = filter;
    }

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
        query["createdBy"] = { $in: userIds };
      } else {
        return { data: [], total: 0 }; // No matching users means no matching orders
      }
    }

    const [data, total] = await Promise.all([
      this.orderModel
        .find(query)
        .populate("createdBy", "_id username email phoneNumber location")
        .populate(
          "orderItems.product",
          "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze"
        )
        .populate(
          "originalOrderItems.product",
          "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze"
        )
        .sort({
          "createdAt" : -1
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  async findOne(orderId: string) {
    const order = await this.orderModel
      .findById(orderId)
      .populate("createdBy", "_id username email phoneNumber location")
      .populate(
        "orderItems.product",
        "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze"
      )
      .populate(
        "originalOrderItems.product",
        "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze"
      )
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }
  async findMultiple(orderIds : string[]){
    return await this.orderModel.find({ _id : { $in : orderIds }});
  }

  async createOrder(createOrderDTO: CreateOrderDTO) {
    const { createdBy, orderItems } = createOrderDTO;

    const manager = await this.usersService.findOneById(createdBy);
    if (!manager) {
      throw new NotFoundException(`User with ID ${createdBy} not found`);
    }

    const restaurantRank = manager.location.rank;

    const itemsWithPrices = await Promise.all(
      orderItems.map(async (item) => {
        const product = await this.productsService.findOne(item.product.toString());
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.product} not found`
          );
        }

        let price: number;
        switch (restaurantRank) {
          case LocationRank.GOLD:
            price = product.sellingPriceGold;
            break;
          case LocationRank.SILVER:
            price = product.sellingPriceSilver;
            break;
          case LocationRank.BRONZE:
            price = product.sellingPriceBronze;
            break;
          default:
            throw new Error(`Invalid restaurant rank: ${restaurantRank}`);
        }

        return {
          product: item.product,
          quantity: item.quantity,
          price : price || product.purchasePrice || 0,
        };
      })
    );

    const order = new this.orderModel({
      createdBy: new Types.ObjectId(createdBy),
      restaurantRank,
      orderItems: itemsWithPrices,
      originalOrderItems: itemsWithPrices,
      status: OrderStatus.PENDING,
    });

    await order.save();

    return this.orderModel
      .findById(order._id)
      .populate("createdBy", "_id username email phoneNumber location")
      .populate(
        "orderItems.product",
        "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze"
      )
      .populate(
        "originalOrderItems.product",
        "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze"
      )
      .exec();
  }
  async updateOrder(orderId : string, modifiedItems : UpdateOrderDTO["orderItems"]){
    try{
      return await this.orderModel.findByIdAndUpdate(orderId, {$set : {orderItems : modifiedItems, modifiedAt : new Date()}});
    }catch(error){
      throw new Error(`Une erreur est survenue ${error.message}` )
    }
  }

  async processOrder(
    orderId: string,
    action: "decline" | "accept",
  ) {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${orderId} non trouvée`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error("La commande a déjà été traitée");
    }

    if (action === "decline") {
      order.status = OrderStatus.DENIED;
      order.processedAt = new Date();
    } else if (action === "accept") {
      const itemsToProcess = order.orderItems;

      const quantities = itemsToProcess.map((item) => item.quantity);
      if (quantities.some((quantity) => quantity <= 0)) {
        throw new Error("La quantité doit être supérieure à 0");
      }

      for (const item of itemsToProcess) {
        const product = await this.productsService.findOne(
          item.product.toString()
        );
        if (!product) {
          throw new NotFoundException(
            `Produit avec l'ID ${item.product} non trouvé`
          );
        }

        if (product.quantity < item.quantity) {
          throw new Error(`Stock insuffisant pour le produit ${product.name}`);
        }
      }

      order.status = OrderStatus.ACCEPTED;
      order.processedAt = new Date();

      await this.productsService.updateProductStock(order.orderItems);

      await this.deliveryNoteService.createDeliveryNote({
        order: order._id.toString(),
      });
    }

    await order.save();

    return this.orderModel
      .findById(order._id)
      .populate("createdBy", "_id username email phoneNumber location")
      .populate(
        "orderItems.product",
        "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze"
      )
      .populate(
        "originalOrderItems.product",
        "_id name quantity unit stockLimit purchasePrice isBelowStockLimit sellingPriceGold sellingPriceSilver sellingPriceBronze"
      )
      .exec();
  }
}
