import express from "express";
const taskRouter = express.Router();
import { decodeToken } from "../lib/jwt.js";
import {
  addTask,
  deleteTask,
  editTask,
  getTasks,
} from "../controllers/task.controller.js";

taskRouter.use(decodeToken);

taskRouter.post("/add-task", addTask);
taskRouter.post("/get-tasks", getTasks);
taskRouter.patch("/edit-task/:taskid", editTask);
taskRouter.delete("/delete-task/:taskid", deleteTask);

export default taskRouter;
