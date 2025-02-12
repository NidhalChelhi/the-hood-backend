/* eslint-disable @typescript-eslint/no-unused-vars */
import { connect, connection, model, Types } from "mongoose";
import { User, UserSchema } from "./modules/users/user.schema";
import { Supplier, SupplierSchema } from "./modules/suppliers/supplier.schema";
import { Product, ProductSchema } from "./modules/products/product.schema";
import {
  ReceivingNote,
  ReceivingNoteSchema,
} from "./modules/products/receiving-note.schema";
import { Order, OrderSchema } from "./modules/orders/order.schema";
import {
  DeliveryNote,
  DeliveryNoteSchema,
} from "./modules/delivery-notes/delivery-note.schema";
import { UserRole } from "./common/enums/roles.enum";
import { OrderStatus } from "./common/enums/order-status.enum";
import { DeliveryNoteStatus } from "./common/enums/delivery-note-status";
import { LocationRank } from "./common/enums/location-rank.enum";

// MongoDB connection URI
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://nidhalelchelhi:dVqy451rgndp4utW@cluster0.ijtcb.mongodb.net/the-hood";

// Connect to MongoDB
async function connectToDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

// Clear existing data from all collections
async function clearDatabase() {
  try {
    console.log("Clearing database...");
    await connection.dropDatabase();
    console.log("Database cleared");
  } catch (error) {
    console.error("Failed to clear database:", error);
    process.exit(1);
  }
}

// Seed Users
async function seedUsers(): Promise<Types.ObjectId[]> {
  const UserModel = model<User>("User", UserSchema);
  const users = [
    {
      username: "admin",
      password: "admin123", // In a real app, hash the password!
      role: UserRole.Admin,
      email: "admin@thehood.com",
      phoneNumber: "1234567890",
    },
    {
      username: "manager_menzah",
      password: "manager123",
      role: UserRole.RestaurantManager,
      email: "manager_menzah@thehood.com",
      phoneNumber: "0987654321",
      location: {
        name: "The Hood Menzah",
        address: "123 Menzah St, Tunis",
        rank: LocationRank.GOLD,
      },
    },
    {
      username: "manager_bardo",
      password: "manager123",
      role: UserRole.RestaurantManager,
      email: "manager_bardo@thehood.com",
      phoneNumber: "0987654322",
      location: {
        name: "The Hood Bardo",
        address: "456 Bardo St, Tunis",
        rank: LocationRank.SILVER,
      },
    },
    {
      username: "manager_aouina",
      password: "manager123",
      role: UserRole.RestaurantManager,
      email: "manager_aouina@thehood.com",
      phoneNumber: "0987654323",
      location: {
        name: "The Hood Aouina",
        address: "789 Aouina St, Tunis",
        rank: LocationRank.BRONZE,
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
  return createdUsers.map((user) => user._id as Types.ObjectId);
}

// Seed Suppliers
async function seedSuppliers(): Promise<Types.ObjectId[]> {
  const SupplierModel = model<Supplier>("Supplier", SupplierSchema);
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
    console.warn(
      "Duplicate suppliers skipped:",
      error.writeErrors?.length || 0
    );
    return SupplierModel.find({ name: { $in: suppliers.map((s) => s.name) } });
  });
  console.log("Suppliers seeded:", createdSuppliers.length);
  return createdSuppliers.map((supplier) => supplier._id as Types.ObjectId);
}

// Seed Products
async function seedProducts(
  userIds: Types.ObjectId[],
  supplierIds: Types.ObjectId[]
): Promise<Types.ObjectId[]> {
  const ProductModel = model<Product>("Product", ProductSchema);
  const products = [
    // Normal Products (Sellable)
    {
      name: "Beef Steak",
      description: "Premium beef steak, 1kg",
      unit: "kg",
      stockLimit: 100,
      supplier: supplierIds[1], // Meat & Poultry Ltd.
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
      supplier: supplierIds[1], // Meat & Poultry Ltd.
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
      supplier: supplierIds[2], // Beverage Distributors
      quantity: 300,
      purchasePrice: 1.5,
      sellingPriceGold: 3.0,
      sellingPriceSilver: 2.8,
      sellingPriceBronze: 2.5,
      isBelowStockLimit: false,
      isRawMaterial: false,
      isActive: true,
    },
    // Raw Materials (Non-Sellable)
    {
      name: "Wheat Flour",
      description: "High-quality wheat flour, 25kg",
      unit: "kg",
      stockLimit: 1000,
      supplier: supplierIds[0], // Fresh Produce Co.
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
      supplier: supplierIds[0], // Fresh Produce Co.
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
  return createdProducts.map((product) => product._id as Types.ObjectId);
}

// Seed Receiving Notes
async function seedReceivingNotes(
  productIds: Types.ObjectId[],
  supplierIds: Types.ObjectId[]
) {
  const ReceivingNoteModel = model<ReceivingNote>(
    "ReceivingNote",
    ReceivingNoteSchema
  );

  const receivingNotes = [
    {
      items: [
        {
          product: productIds[0], // Beef Steak
          quantityAdded: 50,
          purchasePrice: 25.0,
        },
        {
          product: productIds[1], // Chicken Breast
          quantityAdded: 100,
          purchasePrice: 10.0,
        },
      ],
      supplier: supplierIds[1], // Meat & Poultry Ltd.
    },
    {
      items: [
        {
          product: productIds[2], // Coca-Cola
          quantityAdded: 300,
          purchasePrice: 1.5,
        },
      ],
      supplier: supplierIds[2], // Beverage Distributors
    },
    {
      items: [
        {
          product: productIds[3], // Wheat Flour
          quantityAdded: 800,
          purchasePrice: 0.5,
        },
        {
          product: productIds[4], // Tomato Paste
          quantityAdded: 300,
          purchasePrice: 2.0,
        },
      ],
      supplier: supplierIds[0], // Fresh Produce Co.
    },
  ];

  console.log("Inserting receiving notes...");
  await ReceivingNoteModel.insertMany(receivingNotes, { ordered: false }).catch(
    (error) => {
      console.warn(
        "Duplicate receiving notes skipped:",
        error.writeErrors?.length || 0
      );
    }
  );
}

// Seed Orders
async function seedOrders(
  userIds: Types.ObjectId[],
  productIds: Types.ObjectId[]
) {
  const OrderModel = model<Order>("Order", OrderSchema);

  // Filter out raw materials (only include products with isRawMaterial: false)
  const orderableProductIds = (await model<Product>("Product")
    .find({ isRawMaterial: false })
    .distinct("_id")) as Types.ObjectId[];

  const orders = [
    {
      createdBy: userIds[1], // manager_menzah (Gold)
      orderItems: [
        {
          product: orderableProductIds[0], // Beef Steak
          quantity: 10,
          price: 35.0, // Gold price
        },
        {
          product: orderableProductIds[2], // Coca-Cola
          quantity: 50,
          price: 3.0, // Gold price
        },
      ],
      status: OrderStatus.PENDING,
    },
    {
      createdBy: userIds[2], // manager_bardo (Silver)
      orderItems: [
        {
          product: orderableProductIds[1], // Chicken Breast
          quantity: 20,
          price: 14.0, // Silver price
        },
      ],
      status: OrderStatus.ACCEPTED,
      processedAt: new Date(),
    },
    {
      createdBy: userIds[3], // manager_aouina (Bronze)
      orderItems: [
        {
          product: orderableProductIds[0], // Beef Steak
          quantity: 15,
          price: 30.0, // Bronze price
        },
      ],
      status: OrderStatus.PENDING,
    },
  ];

  console.log("Inserting orders...");
  await OrderModel.insertMany(orders, { ordered: false }).catch((error) => {
    console.warn("Duplicate orders skipped:", error.writeErrors?.length || 0);
  });
}

// Seed Delivery Notes
async function seedDeliveryNotes(orderIds: Types.ObjectId[]) {
  const DeliveryNoteModel = model<DeliveryNote>(
    "DeliveryNote",
    DeliveryNoteSchema
  );
  const deliveryNotes = [
    {
      order: orderIds[0],
      status: DeliveryNoteStatus.PENDING,
    },
    {
      order: orderIds[1],
      status: DeliveryNoteStatus.INVOICED,
    },
    {
      order: orderIds[2],
      status: DeliveryNoteStatus.PENDING,
    },
  ];

  console.log("Inserting delivery notes...");
  await DeliveryNoteModel.insertMany(deliveryNotes, { ordered: false }).catch(
    (error) => {
      console.warn(
        "Duplicate delivery notes skipped:",
        error.writeErrors?.length || 0
      );
    }
  );
}

// Main function to run the seed script
export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    await connectToDatabase();
    await clearDatabase();

    // Seed data in the correct order
    const userIds = await seedUsers();
    const supplierIds = await seedSuppliers();
    const productIds = await seedProducts(userIds, supplierIds);
    await seedReceivingNotes(productIds, supplierIds);
    await seedOrders(userIds, productIds);
    const orderIds = (await model<Order>("Order")
      .find()
      .distinct("_id")) as Types.ObjectId[];
    await seedDeliveryNotes(orderIds);

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}
