import * as bcrypt from "bcrypt";
import mongoose, { Model } from "mongoose";
import { User, UserSchema } from "../modules/users/user.schema";
import * as dotenv from "dotenv";
import { connectToDatabase, closeDatabaseConnection } from "./seeder-utils";

dotenv.config();

async function seedUsers() {
  const MONGO_URI = process.env.MONGO_URI!;

  await connectToDatabase(MONGO_URI);

  try {
    const UserModel: Model<User> = mongoose.model("User", UserSchema);

    await UserModel.deleteMany({});
    console.log("Cleared existing user data.");

    const users = [
      {
        username: "admin",
        password: await bcrypt.hash("AdminPass123", 10),
        role: "admin",
        email: "admin@example.com",
      },
      {
        username: "manager1",
        password: await bcrypt.hash("ManagerPass123", 10),
        role: "restaurant_manager",
        email: "manager1@example.com",
        phoneNumber: "123456789",
        location: {
          name: "Restaurant A",
          rank: "gold",
          address: "123 Gold Street",
        },
      },
      {
        username: "manager2",
        password: await bcrypt.hash("ManagerPass456", 10),
        role: "restaurant_manager",
        email: "manager2@example.com",
        phoneNumber: "987654321",
        location: {
          name: "Restaurant B",
          rank: "silver",
          address: "456 Silver Avenue",
        },
      },
      {
        username: "manager3",
        password: await bcrypt.hash("ManagerPass789", 10),
        role: "restaurant_manager",
        email: "manager3@example.com",
        phoneNumber: "456789123",
        location: {
          name: "Restaurant C",
          rank: "bronze",
          address: "789 Bronze Road",
        },
      },
    ];

    await UserModel.insertMany(users);
    console.log(
      "Seeded users:",
      users.map((user) => user.username)
    );
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    closeDatabaseConnection();
  }
}

seedUsers();
