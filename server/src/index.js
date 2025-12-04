import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
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

await connectDB();

const app = express();
const PORT = process.env.PORT;
const frontend = process.env.CLIENT_URL;

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [frontend],
    credentials: true,
  })
);
app.use(helmet());

app.use(ratelimiter);
// middlewares

app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth/google", googleAuthRouter);
app.use("/api/auth/github", githubAuthRouter);
app.use("/api/auth", authRouter);

app.use("/api", protectedRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/projects", projectRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
