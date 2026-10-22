import userModel from "../models/user.model.js";
import tasksModel from "../models/task.model.js";
import projectsModel from "../models/project.model.js";
import feedback from "../models/feedback.js";
import mongoose from "mongoose";
import { feedbackSchema } from "../validation/feedback.validate.js";
import { formatZodError } from "../validation/helpers.js";

export const getUserData = async (req, res) => {
  const id = req.user.id;
  const user = await userModel.findOne({ _id: id });
  if (!user) {
    return res.status(401).json({ reply: "Unauthorized", success: false });
  }
  return res.status(200).json({
    reply: {
      displayName: user.displayName,
      email:
        user.email && user.email.trim() !== "" ? user.email : user.userName,
      avatar: user.avatar,
    },
    success: true,
  });
};

export const getDashboardData = async (req, res) => {
  const userId = req.user.id;

  // -------------------------
  // Utility Helpers
  // -------------------------

  const normalize = (d) => {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  };

  const today = normalize(new Date());

  const getDiffDays = (date) =>
    (normalize(date) - today) / (1000 * 60 * 60 * 24);

  const getWeekdayName = (date) => {
    const weekMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekMap[new Date(date).getDay()];
  };

  const getCurrentWeekRange = () => {
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const isInThisWeek = (date) => {
    const d = normalize(date);
    const { monday, sunday } = getCurrentWeekRange();
    return d >= monday && d <= sunday;
  };

  // -------------------------
  // Dashboard Data Containers
  // -------------------------

  const taskCardData = {
    overDue: 0,
    dueToday: 0,
    todaysProgress: 0,
    todayPending: 0,
    todayCompleted: 0,
  };

  const projectCardData = {
    overDue: 0,
    dueToday: 0,
    totalProjects: 0,
    completed: 0,
  };

  const barChartData = {
    completed: 0,
    pending: 0,
    overDue: 0,
  };

  const lineChartData = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  let todaysFocusData = [];
  let upcomingData = [];
  let completedData = [];

  // -------------------------
  // Processing Functions
  // -------------------------

  // -------------------------
  // Main Execution (Single-Pass Aggregation)
  // -------------------------

  const [allTasks, allProjects] = await Promise.all([
    tasksModel.find({ createdBy: userId }).lean(),
    projectsModel.find({ createdBy: userId }).lean(),
  ]);

  for (const task of allTasks) {
    const diff = getDiffDays(task.dueDate);
    const diffCompleted = task.completedAt ? getDiffDays(task.completedAt) : null;

    // 1. Task cards (personal tasks only)
    if (task.type === "personal") {
      if (diff === 0) {
        if (!task.completed) taskCardData.dueToday++;
        taskCardData.todaysProgress++;
        if (task.completed) taskCardData.todayCompleted++;
        else taskCardData.todayPending++;
      }
      if (diff < 0) taskCardData.overDue++;
    }

    // 2. Bar chart
    if (task.completed) {
      barChartData.completed++;
    } else {
      barChartData.pending++;
      if (diff < 0) barChartData.overDue++;
    }

    // 3. Line chart
    if (task.completed && isInThisWeek(task.completedAt)) {
      const day = getWeekdayName(task.completedAt);
      lineChartData[day]++;
    }

    // 4. Today focus
    if ((diff === 0 || diff === -1) && !task.completed) {
      todaysFocusData.push({
        id: task._id,
        name: task.title,
        priority:
          task.priority === 1
            ? "High"
            : task.priority === 2
            ? "Medium"
            : "Low",
        type: task.type,
        date:
          diff === 0
            ? "today"
            : `yesterday ${new Date(task.dueDate).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}`,
      });
    }

    // 5. Upcoming tasks
    if (!task.completed && diff > 0 && diff <= 3) {
      upcomingData.push({
        id: task._id,
        name: task.title,
        type: task.type,
        date: new Date(task.dueDate).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    }

    // 6. Completed tasks
    if (
      task.completed &&
      diffCompleted !== null &&
      (diffCompleted === 0 || (diffCompleted < 0 && diffCompleted > -4))
    ) {
      completedData.push({
        name: task.title,
        type: task.type,
        date: new Date(task.completedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    }
  }

  // Project cards
  for (const project of allProjects) {
    const diff = getDiffDays(project.dueDate);
    if (project.completed) projectCardData.completed++;
    if (diff === 0) projectCardData.dueToday++;
    if (diff < 0) projectCardData.overDue++;

    projectCardData.totalProjects++;
  }

  // Final Response
  return res.status(200).json({
    success: true,
    reply: "Fetched Dashboard Data",
    dashboardData: {
      taskCardData,
      projectCardData,
      barChartData,
      lineChartData,
      todaysFocusData,
      upcomingData,
      completedData,
    },
  });
};

export const exportData = async (req, res) => {
  const userId = req.user.id;

  const [tasks, projects] = await Promise.all([
    tasksModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "linkedProject", 
          foreignField: "_id", 
          as: "project",
        },
      },
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          projectTitle: "$project.title",
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          createdBy: 0,
          linkedProject: 0,
          project: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    ]),

    projectsModel
      .find({ createdBy: userId })
      .select("-_id -__v -createdBy")
      .lean(),
  ]);

  return res.status(200).json({
    reply: "Fetched",
    success: true,
    data: { tasks, projects },
  });
};

export const saveFeedBack = async (req, res) => {
  const id = req.user.id;
  const result = feedbackSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(formatZodError(result.error));
  }

  const user = await userModel.findOne({ _id: id });
  if (!user) {
    return res.status(404).json({ reply: "User not found", success: false });
  }

  await feedback.create({
    from: user.displayName || user.userName || "Anonymous",
    feedback: result.data.message,
  });
  return res.status(200).json({ reply: "Feedback Sent", success: true });
};
