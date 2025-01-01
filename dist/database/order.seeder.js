"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv = require("dotenv");
const mongoose_2 = require("mongoose");
const orders_schema_1 = require("../modules/orders/orders.schema");
const user_schema_1 = require("../modules/users/user.schema");
const roles_enum_1 = require("../common/enums/roles.enum");
const product_schema_1 = require("../modules/products/product.schema");
const order_status_enum_1 = require("../common/enums/order-status.enum");
dotenv.config();
async function seedOrder() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not set in the environment variables.");
    }
    await (0, mongoose_2.connect)(process.env.MONGO_URI);
    try {
        const OrderModel = mongoose_1.default.model("Order", orders_schema_1.OrderSchema);
        const UserModel = mongoose_1.default.model("User", user_schema_1.UserSchema);
        const ProductModel = mongoose_1.default.model("Product", product_schema_1.ProductSchema);
        await OrderModel.deleteMany({});
        console.log("Cleared existing order data.");
        const users = await UserModel.find({ role: roles_enum_1.UserRole.RestaurantManager }).exec();
        const products = await ProductModel.find({ isRawMaterial: false }).exec();
        const orders = [
            {
                managerId: users[0]._id,
                productOrders: [
                    {
                        productId: products[0]._id,
                        quantity: 30,
                        status: order_status_enum_1.OrderStatus.Pending,
                    },
                    {
                        productId: products[1]._id,
                        quantity: 10,
                        status: order_status_enum_1.OrderStatus.Pending,
                    },
                    {
                        productId: products[2]._id,
                        quantity: 5,
                        status: order_status_enum_1.OrderStatus.Pending,
                    },
                ],
                totalPrice: 0,
            },
            {
                managerId: users[1]._id,
                productOrders: [
                    {
                        productId: products[2]._id,
                        quantity: 5,
                        status: order_status_enum_1.OrderStatus.Pending,
                    },
                    {
                        productId: products[3]._id,
                        quantity: 10,
                        status: order_status_enum_1.OrderStatus.Pending,
                    },
                    {
                        productId: products[1]._id,
                        quantity: 25,
                        status: order_status_enum_1.OrderStatus.Pending,
                    },
                ],
                totalPrice: 0,
            },
            {
                managerId: users[2]._id,
                productOrders: [
                    {
                        productId: products[0]._id,
                        quantity: 10,
                        status: order_status_enum_1.OrderStatus.Pending,
                    },
                    {
                        productId: products[1]._id,
                        quantity: 20,
                        status: order_status_enum_1.OrderStatus.Pending,
                    },
                    {
                        productId: products[3]._id,
                        quantity: 50,
                        status: order_status_enum_1.OrderStatus.Pending,
                    },
                ],
                totalPrice: 0,
            },
        ];
        const orderDocs = await OrderModel.insertMany(orders);
        console.log("Seeded orders : ", orderDocs);
        console.log("Database seeding completed successfully.");
    }
    catch (error) {
        console.error("Error seeding the database:", error);
    }
    finally {
        mongoose_1.default.disconnect();
    }
}
seedOrder();
//# sourceMappingURL=order.seeder.js.map