import express from "express";
import {
  registerUser,
  verifyUser,
  logOutUser,
  deleteAccount,
  exchangeAuthCode,
} from "../controllers/auth.controller.js";
import { decodeToken } from "../lib/jwt.js";
import { authLimiter } from "../middlewares/ratelimiter.js";

const authRouter = express.Router();

authRouter.post("/register-user", authLimiter, registerUser);
authRouter.post("/verify-user", authLimiter, verifyUser);
authRouter.post("/exchange-code", exchangeAuthCode);
authRouter.delete("/logout-user", logOutUser);
authRouter.use(decodeToken);
authRouter.delete("/delete-account", deleteAccount);

export default authRouter;
