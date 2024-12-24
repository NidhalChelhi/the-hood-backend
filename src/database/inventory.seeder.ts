import mongoose from "mongoose";
import {
  Product,
  ProductSchema,
  SupplyBatch,
  SupplyBatchSchema,
} from "../modules/products/product.schema";
import { Supplier, SupplierSchema } from "../modules/suppliers/supplier.schema";
import * as dotenv from "dotenv";
import { connect } from "mongoose";

dotenv.config();

async function seedInventory() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in the environment variables.");
  }

  await connect(process.env.MONGO_URI);

  try {
    const ProductModel = mongoose.model<Product>("Product", ProductSchema);
    const SupplyBatchModel = mongoose.model<SupplyBatch>(
      "SupplyBatch",
      SupplyBatchSchema
    );
    const SupplierModel = mongoose.model<Supplier>("Supplier", SupplierSchema);

    await ProductModel.deleteMany({});
    await SupplyBatchModel.deleteMany({});
    await SupplierModel.deleteMany({});
    console.log("Cleared existing data.");

    const suppliers = [
      { name: "Supplier A", contact: "123456789", address: "123 Main St" },
      { name: "Supplier B", contact: "987654321", address: "456 Side St" },
      { name: "Supplier C", contact: "555555555", address: "789 Market Rd" },
    ];
    const supplierDocs = await SupplierModel.insertMany(suppliers);
    console.log("Seeded suppliers:", supplierDocs);

    const rawMaterials = [
      {
        name: "Tomatoes",
        description: "Fresh tomatoes for sauce",
        unit: "kg",
        isRawMaterial: true,
        stockLimit: 50,
      },
      {
        name: "Olive Oil",
        description: "High-quality olive oil",
        unit: "liters",
        isRawMaterial: true,
        stockLimit: 20,
      },
      {
        name: "Flour",
        description: "Fine all-purpose flour",
        unit: "kg",
        isRawMaterial: true,
        stockLimit: 100,
      },
      {
        name: "Sugar",
        description: "Granulated sugar",
        unit: "kg",
        isRawMaterial: true,
        stockLimit: 30,
      },
    ];
    const rawMaterialDocs = await ProductModel.insertMany(rawMaterials);
    console.log("Seeded raw materials:", rawMaterialDocs);

    const normalProducts = [
      {
        name: "Ketchup",
        description: "Tomato ketchup made from fresh tomatoes",
        unit: "kg",
        isRawMaterial: false,
        stockLimit: 30,
      },
      {
        name: "Pasta Sauce",
        description: "Italian pasta sauce",
        unit: "liters",
        isRawMaterial: false,
        stockLimit: 15,
      },
      {
        name: "Bread",
        description: "Freshly baked bread",
        unit: "pieces",
        isRawMaterial: false,
        stockLimit: 50,
      },
      {
        name: "Cookies",
        description: "Delicious cookies",
        unit: "packs",
        isRawMaterial: false,
        stockLimit: 25,
      },
    ];
    const normalProductDocs = await ProductModel.insertMany(normalProducts);
    console.log("Seeded normal products:", normalProductDocs);

    const supplyBatches = [
      {
        productId: rawMaterialDocs[0]._id,
        quantity: 100,
        purchasePrice: 3.5,
        supplierId: supplierDocs[0]._id,
      },
      {
        productId: rawMaterialDocs[0]._id,
        quantity: 50,
        purchasePrice: 4.0,
        supplierId: supplierDocs[1]._id,
      },
      {
        productId: rawMaterialDocs[1]._id,
        quantity: 40,
        purchasePrice: 10.0,
        supplierId: supplierDocs[2]._id,
      },
      {
        productId: rawMaterialDocs[1]._id,
        quantity: 20,
        purchasePrice: 11.5,
        supplierId: supplierDocs[0]._id,
      },

      {
        productId: normalProductDocs[0]._id,
        quantity: 30,
        purchasePrice: 10,
        sellingPriceGold: 12,
        sellingPriceSilver: 13,
        sellingPriceBronze: 14,
        supplierId: supplierDocs[1]._id,
        isFromRawMaterial: true,
      },
      {
        productId: normalProductDocs[1]._id,
        quantity: 20,
        purchasePrice: 15,
        sellingPriceGold: 18,
        sellingPriceSilver: 20,
        sellingPriceBronze: 22,
        supplierId: supplierDocs[2]._id,
        isFromRawMaterial: true,
      },
    ];
    const supplyBatchDocs = await SupplyBatchModel.insertMany(supplyBatches);
    console.log("Seeded supply batches:", supplyBatchDocs);

    for (const batch of supplyBatchDocs) {
      await ProductModel.findByIdAndUpdate(batch.productId, {
        $push: { supplyBatchIds: batch._id },
      });
    }
    console.log("Updated product documents with supply batch IDs.");

    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedInventory();
