import express from "express";
import { decodeToken } from "../lib/jwt.js";
import {
  exportData,
  getDashboardData,
  getUserData,
  saveFeedBack,
  getNotifications,
} from "../controllers/protected.controller.js";

const protectedRouter = express.Router();

protectedRouter.use(decodeToken);

protectedRouter.get("/dashboard", getDashboardData);
protectedRouter.get("/get-user", getUserData);
protectedRouter.get("/notifications", getNotifications);
protectedRouter.get("/get-notifications", getNotifications);
protectedRouter.get("/export", exportData);
protectedRouter.post("/feedback", saveFeedBack);

export default protectedRouter;
