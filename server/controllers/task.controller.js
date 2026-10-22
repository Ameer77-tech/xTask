import tasksModel from "../models/task.model.js";
import projectsModel from "../models/project.model.js";
import {
  addTaskSchema,
  getTasksSchema,
  editTaskSchema,
} from "../validation/task.validate.js";
import { formatZodError } from "../validation/helpers.js";

export const addTask = async (req, res) => {
  const userId = req.user.id;
  if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      reply: "Empty request body",
    });
  }

  const result = addTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(formatZodError(result.error));
  }

  const { title, description, type, dueDate, priority, linkedProject } =
    result.data;

  const task = {
    createdBy: userId,
    title,
    description,
    type,
    dueDate,
    priority,
    linkedProject: type === "project" ? linkedProject : null,
  };

  if (task.linkedProject !== null) {
    const projectExists = await projectsModel.findOne({
      _id: linkedProject,
      createdBy: userId,
    });
    if (!projectExists) {
      return res.status(404).json({
        reply: "Linked project not found or unauthorized",
        success: false,
      });
    }
  }

  const created = await tasksModel.create(task);
  if (task.linkedProject !== null) {
    await projectsModel.updateOne(
      { _id: linkedProject, createdBy: userId },
      {
        $push: {
          tasks: created._id,
        },
      }
    );
  }

  return res
    .status(200)
    .json({ reply: "Task Created", success: true, created });
};

export const getTasks = async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0) {
    return res.status(400).json({ reply: "Empty Body", success: false });
  }
  const userId = req.user.id;

  const result = getTasksSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(formatZodError(result.error));
  }

  const { type, filter } = result.data;
  const query = { createdBy: userId, type };

  if (filter === "completed") {
    query.status = "completed";
  }
  if (filter === "in-progress") {
    query.timer = { $gt: 0 };
  }

  const dataTasks = await tasksModel.find(query);
  let tasks;
  if (filter === "in-progress") {
    tasks = dataTasks.filter((task) => task.status !== "completed");
  } else {
    tasks = dataTasks;
  }
  return res
    .status(200)
    .json({ reply: "Fetched Tasks", success: true, tasks });
};

export const editTask = async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0) {
    return res.status(400).json({ reply: "Empty Body", success: false });
  }
  const userId = req.user.id;
  const taskId = req.params.taskid;

  const result = editTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(formatZodError(result.error));
  }

  // Zod schema automatically strips unknown/disallowed fields (_id, createdBy, linkedProject)
  const updateData = { ...result.data };

  // Synchronize completion status and timestamp
  if (updateData.status === "completed" || updateData.completed === true) {
    updateData.completed = true;
    updateData.status = "completed";
    if (!updateData.completedAt) {
      updateData.completedAt = new Date();
    }
  } else if (
    (updateData.status && updateData.status !== "completed") ||
    updateData.completed === false
  ) {
    updateData.completed = false;
    updateData.completedAt = null;
  }

  const updatedTask = await tasksModel.findOneAndUpdate(
    { createdBy: userId, _id: taskId },
    updateData,
    { new: true, runValidators: true, strict: "throw" }
  );

  if (!updatedTask) {
    return res.status(404).json({
      reply: "Task not found",
      success: false,
    });
  }
  return res.status(200).json({
    reply: "Task updated successfully",
    success: true,
    updatedTask,
  });
};

export const deleteTask = async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.taskid;

  const deleted = await tasksModel.findOneAndDelete(
    { createdBy: userId, _id: taskId },
    { new: true }
  );
  if (!deleted) {
    return res.status(404).json({ reply: "Task not found", success: false });
  }

  if (deleted.linkedProject) {
    await projectsModel.updateOne(
      { _id: deleted.linkedProject, createdBy: userId },
      { $pull: { tasks: deleted._id } }
    );
  }

  return res
    .status(200)
    .json({ reply: "Task Deleted", success: true, deleted });
};
