import projectsModel from "../models/project.model.js";
import userModel from "../models/user.model.js";

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
  if (priority && !validPriorities.includes(Number(priority))) {
    return res.status(400).json({
      success: false,
      reply: "Priority must be 1 (low), 2 (medium), or 3 (high)",
    });
  } else {
    const project = {
      createdBy: userId,
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
      status: status,
    };
    try {
      const created = await projectsModel.create(project);
      if (!created) {
        return res
          .status(500)
          .json({ reply: "Error Creating project", success: false });
      }
      return res
        .status(200)
        .json({ reply: "project created", success: true, created });
    } catch (err) {
      return res
        .status(500)
        .json({ reply: "Internal Server Error", success: false, err });
    }
  }
};
export const getProjects = async (req, res) => {
  const userId = req.user.id;
  const filter = req.params.filter;
  try {
    const allProjects = await projectsModel
      .find({ createdBy: userId })
      .lean()
      .populate("tasks");
    const f = filter.toLowerCase();

    let payload;
    payload = allProjects.map((p) => {
      const { tasks, ...rest } = p;

      const totalTasks = tasks?.length;

      const totaltasksCompleted = tasks?.reduce(
        (acc, task) => (task.completed ? acc + 1 : acc),
        0
      );
      const isPending = tasks.some((task) => task.completed || task.timer > 0);

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
    } else {
      payload = payload;
    }

    return res
      .status(200)
      .json({ reply: "Projects Fetched", success: true, payload });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ reply: "Internal Server Error", success: false, err });
  }
};
export const getProject = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.projectId;
  try {
    const project = await projectsModel
      .findOne({ createdBy: userId, _id: id })
      .populate("tasks");
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
  } catch (err) {
    res
      .status(500)
      .json({ reply: "Internal Server Error", success: false, err });
  }
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

  try {
    const updated = await projectsModel.findOneAndUpdate(
      { createdBy: userId, _id: id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({ reply: "Project Updated", success: true, updated });
  } catch (err) {
    res
      .status(500)
      .json({ reply: "Internal Server Error", success: false, err });
  }
};
export const deleteProject = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.projectId;
  try {
    const deleted = await projectsModel.findOneAndDelete(
      {
        createdBy: userId,
        _id: id,
      },
      { new: true }
    );
    if (!deleted || deleted.length < 0) {
      return res
        .status(409)
        .json({ reply: "No Projects to Delete", success: false });
    }
    return res
      .status(200)
      .json({ reply: "Deleted a project", success: true, id: deleted._id });
  } catch (err) {
    res
      .status(500)
      .json({ reply: "Internal Server Error", success: false, err });
  }
};
