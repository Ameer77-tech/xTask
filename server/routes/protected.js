import express from "express";
import { decodeToken } from "../lib/jwt.js";
import {
  exportData,
  getDashboardData,
  getUserData,
} from "../controllers/protected.controller.js";
const protectedRouter = express.Router();

protectedRouter.use(decodeToken);

protectedRouter.get("/dashboard", getDashboardData);
protectedRouter.get("/get-user", getUserData);
protectedRouter.get("/export", exportData);

export default protectedRouter;
