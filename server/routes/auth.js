import express from "express";
import {
  registerUser,
  verifyUser,
  logOutUser,
  deleteAccount,
} from "../controllers/auth.controller.js";
import { decodeToken } from "../lib/jwt.js";
const authRouter = express.Router();

authRouter.post("/register-user", registerUser);
authRouter.post("/verify-user", verifyUser);
authRouter.delete("/logout-user", logOutUser);
authRouter.use(decodeToken);
authRouter.delete("/delete-account", deleteAccount);

export default authRouter;
