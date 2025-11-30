import express from "express";
import { decodeToken } from "../lib/jwt.js";
import {
  addProject,
  deleteProject,
  editProject,
  getProject,
  getProjects,
} from "../controllers/project.controller.js";
const projectRouter = express.Router();

projectRouter.use(decodeToken);

projectRouter.post("/add-project", addProject);
projectRouter.get("/get-projects/:filter", getProjects);
projectRouter.get("/get-project/:projectId", getProject);
projectRouter.patch("/edit-project/:projectId", editProject);
projectRouter.delete("/delete-project/:projectId", deleteProject);

export default projectRouter;
