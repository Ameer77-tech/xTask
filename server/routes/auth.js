import express from "express";
import { registerUser, verifyUser, logOutUser } from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/register-user", registerUser);
authRouter.post("/verify-user", verifyUser)
authRouter.delete("/logout-user", logOutUser)

export default authRouter;
