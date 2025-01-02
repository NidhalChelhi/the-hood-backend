import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { connect } from "mongoose";
import {
    Order,
    OrderSchema
} from "../modules/orders/orders.schema"
import { User ,UserSchema } from "../modules/users/user.schema";
import { UserRole } from "../common/enums/roles.enum";
import { ProductSchema, Product } from "../modules/products/product.schema";

dotenv.config();

async function seedOrder() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in the environment variables.");
  }

  await connect(process.env.MONGO_URI);

  try {
    const OrderModel = mongoose.model<Order>("Order", OrderSchema);
    const UserModel = mongoose.model<User>("User", UserSchema);
    const ProductModel = mongoose.model<Product> ("Product", ProductSchema)

    await OrderModel.deleteMany({});
    console.log("Cleared existing order data.");

//Andna 3 managers w 4 products

    const users = await UserModel.find({role : UserRole.RestaurantManager}).exec();
    const products = await ProductModel.find({isRawMaterial : false}).exec();
    const orders = [
        {
            managerId : users[0]._id,
            productOrders : [
                {
                    productId : products[0]._id,
                    quantity : 30,
                },
                {
                    productId : products[1]._id,
                    quantity : 10,
                },
                {
                    productId : products[2]._id,
                    quantity : 5,
                },
            ],
            originalProductOrders : [
                {
                    productId : products[0]._id,
                    quantity : 30,
                },
                {
                    productId : products[1]._id,
                    quantity : 10,
                },
                {
                    productId : products[2]._id,
                    quantity : 5,
                },
            ],
            totalPrice : 0,
        },
        {
            managerId : users[1]._id,
            productOrders : [
                {
                    productId : products[2]._id,
                    quantity : 5,
                },
                {
                    productId : products[3]._id,
                    quantity : 10,
                },
                {
                    productId : products[1]._id,
                    quantity : 25,
                },
            ],
            originalProductOrders : [
                {
                    productId : products[2]._id,
                    quantity : 5,
                },
                {
                    productId : products[3]._id,
                    quantity : 10,
                },
                {
                    productId : products[1]._id,
                    quantity : 25,
                },
            ],
            totalPrice : 0,
        },
        {
            managerId : users[2]._id,
            productOrders : [
                {
                    productId : products[0]._id,
                    quantity : 10,
                },
                {
                    productId : products[1]._id,
                    quantity : 20,
                },
                {
                    productId : products[3]._id,
                    quantity : 50,
                },
            ],
            originalProductOrders : [
                {
                    productId : products[0]._id,
                    quantity : 10,
                },
                {
                    productId : products[1]._id,
                    quantity : 20,
                },
                {
                    productId : products[3]._id,
                    quantity : 50,
                },
            ],
            totalPrice : 0,
        },
    ]
    const orderDocs = await OrderModel.insertMany(orders);
    console.log("Seeded orders : ", orderDocs);

    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedOrder();
