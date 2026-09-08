import helmet from "helmet";
import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo_routes.js";
import authRoutes from "./routes/auth_Routes.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errorMiddleWare.js";
import userRoutes from "./routes/user_routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
const logger = (req, res, next) => {
  console.log(req.method);
  console.log(req.url);
  console.log(`Time: ${new Date().toLocaleTimeString()}`);

  next();
};

if (process.env.NODE_ENV !== "test") {
  app.use(logger);
}
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,

    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  res.send(swaggerSpec);
});
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(errorMiddleware);

export default app;
