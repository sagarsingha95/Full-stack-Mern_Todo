import "dotenv/config";
import mongoose from "mongoose";

import { resetRateLimiters } from "../middlewares/rateLimitMiddleware.js";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI_TEST);

    console.log("Connected to test database");
  }
});

afterEach(() => {
  resetRateLimiters();
});