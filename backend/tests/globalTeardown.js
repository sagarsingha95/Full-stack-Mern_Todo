import "dotenv/config";
import mongoose from "mongoose";

export default async function globalTeardown() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  console.log("Test database disconnected");
}