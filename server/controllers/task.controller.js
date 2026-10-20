import tasksModel from "../models/task.model.js";
import userModel from "../models/user.model.js";
import projectsModel from "../models/project.model.js";

export const addTask = async (req, res) => {
  const userId = req.user.id;
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      reply: "Empty request body",
    });
  }
  const { title, description, type, dueDate, priority, linkedProject } =
    req.body;

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
  const validTypes = ["personal", "project"];
  if (!type || !validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      reply: "Invalid task type. Must be 'personal' or 'project'",
    });
  }
  if (type === "project" && !linkedProject) {
    return res.status(400).json({
      success: false,
      reply: "Project type requires linkedProject",
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

  const task = {
    createdBy: userId,
    title: title.trim(),
    description: description || "",
    type: type.toLowerCase(),
    dueDate: dueDate,
    priority: priority !== undefined ? Number(priority) : 1,
    linkedProject: type === "project" ? linkedProject : null,
  };

  const created = await tasksModel.create(task);
  if (task.linkedProject !== null) {
    const updated = await projectsModel.findOneAndUpdate(
      { _id: linkedProject, createdBy: userId },
      {
        $push: {
          tasks: created._id,
        },
      },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(400).json({
        reply: "Task Was Created But Failed Link The Project",
        success: false,
      });
    }
  }

  return res
    .status(200)
    .json({ reply: "Task Created", success: true, created });
};

export const getTasks = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ reply: "Empty Body", success: false });
  }
  const userId = req.user.id;

  const data = req.body;
  const type = String(data.type || "").toLowerCase();
  const filter = String(data.filter || "").toLowerCase();

  if (!["personal", "project"].includes(type)) {
    return res.status(400).json({
      reply: "type of task is not valid",
      success: false,
    });
  }

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
  if (!req.body) {
    return res.status(400).json({ reply: "Empty Body", success: false });
  }
  const userId = req.user.id;
  const taskId = req.params.taskid;

  const disallowed = ["_id", "createdBy", "linkedProject"];
  const updatedTerms = {};

  Object.entries(req.body).forEach(([key, value]) => {
    if (!disallowed.includes(key) && value !== undefined) {
      updatedTerms[key] = value;
    }
  });

  const updatedTask = await tasksModel.findOneAndUpdate(
    { createdBy: userId, _id: taskId },
    updatedTerms,
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
  return res
    .status(200)
    .json({ reply: "Task Deleted", success: true, deleted });
};
