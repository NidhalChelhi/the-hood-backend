import mongoose from "mongoose";

export const connectToDatabase = async (mongoUri: string) => {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in the environment variables.");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to the database.");
};

export const closeDatabaseConnection = () => {
  mongoose.disconnect();
  console.log("Disconnected from the database.");
};
