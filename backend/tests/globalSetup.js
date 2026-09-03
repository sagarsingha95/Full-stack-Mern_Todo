import "dotenv/config";
import mongoose from "mongoose";

export default async function globalSetup() {
  await mongoose.connect(process.env.MONGO_URI_TEST);

  console.log("Connected to test database");

  await mongoose.connection.dropDatabase();

  await mongoose.connection.close();
}