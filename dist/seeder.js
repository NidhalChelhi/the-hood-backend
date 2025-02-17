"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const mongoose_1 = require("mongoose");
const user_schema_1 = require("./modules/users/user.schema");
const supplier_schema_1 = require("./modules/suppliers/supplier.schema");
const product_schema_1 = require("./modules/products/product.schema");
const receiving_note_schema_1 = require("./modules/products/receiving-note.schema");
const order_schema_1 = require("./modules/orders/order.schema");
const delivery_note_schema_1 = require("./modules/delivery-notes/delivery-note.schema");
const roles_enum_1 = require("./common/enums/roles.enum");
const order_status_enum_1 = require("./common/enums/order-status.enum");
const delivery_note_status_1 = require("./common/enums/delivery-note-status");
const location_rank_enum_1 = require("./common/enums/location-rank.enum");
const bcrypt = require("bcrypt");
const MONGO_URI = process.env.MONGO_URI ||
    "mongodb+srv://nidhalelchelhi:dVqy451rgndp4utW@cluster0.ijtcb.mongodb.net/the-hood";
async function connectToDatabase() {
    try {
        console.log("Connecting to MongoDB...");
        await (0, mongoose_1.connect)(MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
async function clearDatabase() {
    try {
        console.log("Clearing database...");
        await mongoose_1.connection.dropDatabase();
        console.log("Database cleared");
    }
    catch (error) {
        console.error("Failed to clear database:", error);
        process.exit(1);
    }
}
async function seedUsers() {
    const UserModel = (0, mongoose_1.model)("User", user_schema_1.UserSchema);
    const users = [
        {
            username: "admin",
            password: await bcrypt.hash("admin123", 10),
            role: roles_enum_1.UserRole.Admin,
            email: "admin@thehood.com",
            phoneNumber: "1234567890",
        },
        {
            username: "manager_menzah",
            password: await bcrypt.hash("manager123", 10),
            role: roles_enum_1.UserRole.RestaurantManager,
            email: "manager_menzah@thehood.com",
            phoneNumber: "0987654321",
            location: {
                name: "The Hood Menzah",
                address: "123 Menzah St, Tunis",
                rank: location_rank_enum_1.LocationRank.GOLD,
            },
        },
        {
            username: "manager_bardo",
            password: await bcrypt.hash("manager123", 10),
            role: roles_enum_1.UserRole.RestaurantManager,
            email: "manager_bardo@thehood.com",
            phoneNumber: "0987654322",
            location: {
                name: "The Hood Bardo",
                address: "456 Bardo St, Tunis",
                rank: location_rank_enum_1.LocationRank.SILVER,
            },
        },
        {
            username: "manager_aouina",
            password: await bcrypt.hash("manager123", 10),
            role: roles_enum_1.UserRole.RestaurantManager,
            email: "manager_aouina@thehood.com",
            phoneNumber: "0987654323",
            location: {
                name: "The Hood Aouina",
                address: "789 Aouina St, Tunis",
                rank: location_rank_enum_1.LocationRank.BRONZE,
            },
        },
    ];
    console.log("Inserting users...");
    const createdUsers = await UserModel.insertMany(users, {
        ordered: false,
    }).catch((error) => {
        console.warn("Duplicate users skipped:", error.writeErrors?.length || 0);
        return UserModel.find({ username: { $in: users.map((u) => u.username) } });
    });
    console.log("Users seeded:", createdUsers.length);
    return createdUsers.map((user) => user._id);
}
async function seedSuppliers() {
    const SupplierModel = (0, mongoose_1.model)("Supplier", supplier_schema_1.SupplierSchema);
    const suppliers = [
        {
            name: "Fresh Produce Co.",
            contact: "contact@freshproduce.com",
            address: "123 Farm St, Tunis",
        },
        {
            name: "Meat & Poultry Ltd.",
            contact: "sales@meatpoultry.com",
            address: "456 Butcher St, Tunis",
        },
        {
            name: "Beverage Distributors",
            contact: "info@beveragedistributors.com",
            address: "789 Drink St, Tunis",
        },
    ];
    console.log("Inserting suppliers...");
    const createdSuppliers = await SupplierModel.insertMany(suppliers, {
        ordered: false,
    }).catch((error) => {
        console.warn("Duplicate suppliers skipped:", error.writeErrors?.length || 0);
        return SupplierModel.find({ name: { $in: suppliers.map((s) => s.name) } });
    });
    console.log("Suppliers seeded:", createdSuppliers.length);
    return createdSuppliers.map((supplier) => supplier._id);
}
async function seedProducts(userIds, supplierIds) {
    const ProductModel = (0, mongoose_1.model)("Product", product_schema_1.ProductSchema);
    const products = [
        {
            name: "Beef Steak",
            description: "Premium beef steak, 1kg",
            unit: "kg",
            stockLimit: 100,
            supplier: supplierIds[1],
            quantity: 50,
            purchasePrice: 25.0,
            sellingPriceGold: 35.0,
            sellingPriceSilver: 33.0,
            sellingPriceBronze: 30.0,
            isBelowStockLimit: false,
            isRawMaterial: false,
            isActive: true,
        },
        {
            name: "Chicken Breast",
            description: "Boneless chicken breast, 1kg",
            unit: "kg",
            stockLimit: 200,
            supplier: supplierIds[1],
            quantity: 100,
            purchasePrice: 10.0,
            sellingPriceGold: 15.0,
            sellingPriceSilver: 14.0,
            sellingPriceBronze: 13.0,
            isBelowStockLimit: false,
            isRawMaterial: false,
            isActive: true,
        },
        {
            name: "Coca-Cola",
            description: "330ml can",
            unit: "can",
            stockLimit: 500,
            supplier: supplierIds[2],
            quantity: 300,
            purchasePrice: 1.5,
            sellingPriceGold: 3.0,
            sellingPriceSilver: 2.8,
            sellingPriceBronze: 2.5,
            isBelowStockLimit: false,
            isRawMaterial: false,
            isActive: true,
        },
        {
            name: "Wheat Flour",
            description: "High-quality wheat flour, 25kg",
            unit: "kg",
            stockLimit: 1000,
            supplier: supplierIds[0],
            quantity: 800,
            purchasePrice: 0.5,
            isBelowStockLimit: false,
            isRawMaterial: true,
            isActive: true,
        },
        {
            name: "Tomato Paste",
            description: "Concentrated tomato paste, 5kg",
            unit: "kg",
            stockLimit: 500,
            supplier: supplierIds[0],
            quantity: 300,
            purchasePrice: 2.0,
            isBelowStockLimit: false,
            isRawMaterial: true,
            isActive: true,
        },
    ];
    console.log("Inserting products...");
    const createdProducts = await ProductModel.insertMany(products, {
        ordered: false,
    }).catch((error) => {
        console.warn("Duplicate products skipped:", error.writeErrors?.length || 0);
        return ProductModel.find({ name: { $in: products.map((p) => p.name) } });
    });
    console.log("Products seeded:", createdProducts.length);
    return createdProducts.map((product) => product._id);
}
async function seedReceivingNotes(productIds, supplierIds) {
    const ReceivingNoteModel = (0, mongoose_1.model)("ReceivingNote", receiving_note_schema_1.ReceivingNoteSchema);
    const receivingNotes = [
        {
            items: [
                {
                    product: productIds[0],
                    quantityAdded: 50,
                    purchasePrice: 25.0,
                },
                {
                    product: productIds[1],
                    quantityAdded: 100,
                    purchasePrice: 10.0,
                },
            ],
            supplier: supplierIds[1],
        },
        {
            items: [
                {
                    product: productIds[2],
                    quantityAdded: 300,
                    purchasePrice: 1.5,
                },
            ],
            supplier: supplierIds[2],
        },
        {
            items: [
                {
                    product: productIds[3],
                    quantityAdded: 800,
                    purchasePrice: 0.5,
                },
                {
                    product: productIds[4],
                    quantityAdded: 300,
                    purchasePrice: 2.0,
                },
            ],
            supplier: supplierIds[0],
        },
    ];
    console.log("Inserting receiving notes...");
    await ReceivingNoteModel.insertMany(receivingNotes, { ordered: false }).catch((error) => {
        console.warn("Duplicate receiving notes skipped:", error.writeErrors?.length || 0);
    });
}
async function seedOrders(userIds, productIds) {
    const OrderModel = (0, mongoose_1.model)("Order", order_schema_1.OrderSchema);
    const orderableProductIds = (await (0, mongoose_1.model)("Product")
        .find({ isRawMaterial: false })
        .distinct("_id"));
    const orders = [
        {
            createdBy: userIds[1],
            orderItems: [
                {
                    product: orderableProductIds[0],
                    quantity: 10,
                    price: 35.0,
                },
                {
                    product: orderableProductIds[2],
                    quantity: 50,
                    price: 3.0,
                },
            ],
            status: order_status_enum_1.OrderStatus.PENDING,
        },
        {
            createdBy: userIds[2],
            orderItems: [
                {
                    product: orderableProductIds[1],
                    quantity: 20,
                    price: 14.0,
                },
            ],
            status: order_status_enum_1.OrderStatus.ACCEPTED,
            processedAt: new Date(),
        },
        {
            createdBy: userIds[3],
            orderItems: [
                {
                    product: orderableProductIds[0],
                    quantity: 15,
                    price: 30.0,
                },
            ],
            status: order_status_enum_1.OrderStatus.PENDING,
        },
    ];
    console.log("Inserting orders...");
    await OrderModel.insertMany(orders, { ordered: false }).catch((error) => {
        console.warn("Duplicate orders skipped:", error.writeErrors?.length || 0);
    });
}
async function seedDeliveryNotes(orderIds) {
    const DeliveryNoteModel = (0, mongoose_1.model)("DeliveryNote", delivery_note_schema_1.DeliveryNoteSchema);
    const deliveryNotes = [
        {
            order: orderIds[0],
            status: delivery_note_status_1.DeliveryNoteStatus.PENDING,
        },
        {
            order: orderIds[1],
            status: delivery_note_status_1.DeliveryNoteStatus.INVOICED,
        },
        {
            order: orderIds[2],
            status: delivery_note_status_1.DeliveryNoteStatus.PENDING,
        },
    ];
    console.log("Inserting delivery notes...");
    await DeliveryNoteModel.insertMany(deliveryNotes, { ordered: false }).catch((error) => {
        console.warn("Duplicate delivery notes skipped:", error.writeErrors?.length || 0);
    });
}
async function seedDatabase() {
    try {
        console.log("Starting database seeding...");
        await connectToDatabase();
        await clearDatabase();
        const userIds = await seedUsers();
        const supplierIds = await seedSuppliers();
        const productIds = await seedProducts(userIds, supplierIds);
        await seedReceivingNotes(productIds, supplierIds);
        await seedOrders(userIds, productIds);
        const orderIds = (await (0, mongoose_1.model)("Order")
            .find()
            .distinct("_id"));
        await seedDeliveryNotes(orderIds);
        console.log("Database seeding completed!");
        await mongoose_1.connection.close();
    }
    catch (error) {
        console.error("Error during database seeding:", error);
        await mongoose_1.connection.close();
    }
}
seedDatabase().then(() => {
    console.log("Seeding successful");
});
//# sourceMappingURL=seeder.js.map