import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB successfully connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("MongoDB disconnect failed:", error.message);
  }
};

export { connectDB, disconnectDB };