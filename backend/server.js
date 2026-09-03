import "dotenv/config";

import app from "./app.js";
import validateEnv from "./config/env.js";

import {
  connectDB,
  disconnectDB,
} from "./config/db.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Validate env first.....


    validateEnv();

    
    // ==========================================
    // CONNECT DATABASE
    // ==========================================



    await connectDB();

    // ==========================================
    // START SERVER
    // ==========================================

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // ==========================================
    // GRACEFUL SHUTDOWN
    // ==========================================

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        console.log("HTTP server closed");

        await disconnectDB();

        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Server startup failed:", error.message);

    process.exit(1);
  }
};

startServer();