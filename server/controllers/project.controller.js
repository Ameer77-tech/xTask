import projectsModel from "../models/project.model.js";
import tasksModel from "../models/task.model.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

export const addProject = async (req, res) => {
  const userId = req.user.id;
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      reply: "Empty request body",
    });
  }
  const { title, description, dueDate, priority, status } = req.body;
  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      reply: "Title is required",
    });
  }
  if (description && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      reply: "Description must be a string",
    });
  }
  if (!dueDate || isNaN(Date.parse(dueDate))) {
    return res.status(400).json({
      success: false,
      reply: "Invalid dueDate format, must be a valid date",
    });
  }
  const validPriorities = [1, 2, 3];
  if (priority !== undefined && !validPriorities.includes(Number(priority))) {
    return res.status(400).json({
      success: false,
      reply: "Priority must be 1 (low), 2 (medium), or 3 (high)",
    });
  }

  const project = {
    createdBy: userId,
    title: title.trim(),
    description: description || "",
    dueDate: dueDate,
    priority: priority !== undefined ? Number(priority) : 1,
    status: status || "not-started",
  };

  const created = await projectsModel.create(project);
  if (!created) {
    return res
      .status(500)
      .json({ reply: "Error Creating project", success: false });
  }
  return res
    .status(200)
    .json({ reply: "project created", success: true, created });
};

export const getProjects = async (req, res) => {
  const userId = req.user.id;
  const filter = req.params.filter;

  const allProjects = await projectsModel
    .find({ createdBy: userId })
    .lean()
    .populate("tasks");
  const f = filter.toLowerCase();

  let payload = allProjects.map((p) => {
    const { tasks, ...rest } = p;

    const totalTasks = tasks?.length || 0;

    const totaltasksCompleted =
      tasks?.reduce((acc, task) => (task.completed ? acc + 1 : acc), 0) || 0;
    const isPending = totalTasks > 0 && !p.completed;

    return {
      ...rest,
      totalTasks,
      totaltasksCompleted,
      status:
        p.status === "planning" && !isPending
          ? "planning"
          : p.completed
          ? "completed"
          : isPending
          ? "in-progress"
          : "not-started",
    };
  });

  if (f === "in-progress") {
    payload = payload.filter((p) => p.tasks?.length > 0 && !p.completed);
  } else if (f === "completed") {
    payload = payload.filter((p) => p.completed);
  }

  return res
    .status(200)
    .json({ reply: "Projects Fetched", success: true, payload });
};

export const getProject = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.projectId;

  const project = await projectsModel
    .findOne({ createdBy: userId, _id: id })
    .populate("tasks");

  if (!project) {
    return res.status(404).json({
      reply: "Project not found",
      success: false,
    });
  }

  const payload = {
    projectId: project._id,
    projectTitle: project.title,
    projectDescription: project.description,
    projectPriority: project.priority,
    tasks: project.tasks,
  };

  return res.status(200).json({
    reply: "Project Fetched",
    success: true,
    payload,
  });
};

export const editProject = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.projectId;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      reply: "Empty request body",
    });
  }

  const updated = await projectsModel.findOneAndUpdate(
    { createdBy: userId, _id: id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updated) {
    return res.status(404).json({
      success: false,
      reply: "Project not found",
    });
  }

  // When marking project completed, mark all its linked tasks completed instead of permanently deleting them
  if (req.body.completed && updated.tasks?.length > 0) {
    const objectIds = updated.tasks.map(
      (taskId) => new mongoose.Types.ObjectId(taskId)
    );
    await tasksModel.updateMany(
      { _id: { $in: objectIds } },
      { $set: { completed: true, status: "completed", completedAt: new Date() } }
    );
  }

  return res.status(200).json({
    reply: "Project Updated",
    success: true,
    updated,
  });
};

export const deleteProject = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.projectId;

  const deleted = await projectsModel.findOneAndDelete(
    {
      createdBy: userId,
      _id: id,
    },
    { new: true }
  );
  if (!deleted) {
    return res
      .status(404)
      .json({ reply: "No Projects to Delete", success: false });
  }

  if (deleted.tasks?.length > 0) {
    const objectIds = deleted.tasks.map(
      (taskId) => new mongoose.Types.ObjectId(taskId)
    );
    await tasksModel.deleteMany({ _id: { $in: objectIds } });
  }

  return res
    .status(200)
    .json({ reply: "Deleted a project", success: true, id: deleted._id });
};
