import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "../config/dbConn.js";
import passport from "passport";
import googleAuthRouter from "../routes/auth.google.js";
import "../lib/passport.js";
import cookieParser from "cookie-parser";
import protectedRouter from "../routes/protected.js";
import githubAuthRouter from "../routes/auth.github.js";
import authRouter from "../routes/auth.js";
import taskRouter from "../routes/task.js";
import projectRouter from "../routes/project.js";
import helmet from "helmet";
import ratelimiter from "../middlewares/ratelimiter.js";
import sanitizeMiddleware from "../middlewares/Sanitize.js";
import logger from "../lib/logger.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";

await connectDB();

const app = express();
const PORT = process.env.PORT;
const frontend = process.env.CLIENT_URL;

// middlewares
const allowedOrigins = [
  ...(process.env.NODE_ENV !== "production"
    ? ["http://localhost:3000", "http://localhost:5173"]
    : []),
  frontend,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    },
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Health check before rate limiter so probes/uptime monitors are never blocked
app.get("/health", (req, res) => {
  res.send("Server Running");
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize body, query, and params against NoSQL injection
app.use(sanitizeMiddleware);

app.use(helmet());
app.use(ratelimiter);

app.use(passport.initialize());

app.use(logger);
app.use("/api/auth/google", googleAuthRouter);
app.use("/api/auth/github", githubAuthRouter);
app.use("/api/auth", authRouter);

app.use("/api", protectedRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/projects", projectRouter);

app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const handleShutdown = async (signal) => {
  console.log(`\n[${signal}] Initiating graceful shutdown...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed.");
      process.exit(0);
    } catch (err) {
      console.error("Error closing MongoDB connection:", err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error("Graceful shutdown timeout exceeded. Forcefully terminating.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));
