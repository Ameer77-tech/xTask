import userModel from "../models/user.model.js";
import tasksModel from "../models/task.model.js";
import projectsModel from "../models/project.model.js";

export const getUserData = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModel.findOne({ _id: id });
    if (user === null) {
      return res.status(401).json({ reply: "Unauthorized", success: false });
    }
    res.status(200).json({
      reply: {
        displayName: user.displayName,
        email: !user.email == "" ? user.email : user.userName,
        avatar: user.avatar,
      },
      success: true,
    });
  } catch (err) {
    res.status(500).json({ reply: "Internal Server Error", success: false });
  }
};

// =========================
//  Dashboard Controller
// =========================

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

  const processTaskCards = (tasks) => {
    for (const task of tasks) {
      if (task.type !== "personal") continue;

      const diff = getDiffDays(task.dueDate);

      if (diff === 0) {
        if (!task.completed) taskCardData.dueToday++;
        taskCardData.todaysProgress++;
        if (task.completed) taskCardData.todayCompleted++;
        else taskCardData.todayPending++;
      }

      if (diff < 0) taskCardData.overDue++;
    }
  };

  const processProjectCards = (projects) => {
    for (const project of projects) {
      const diff = getDiffDays(project.dueDate);
      if (project.completed) projectCardData.completed++;
      if (diff === 0) projectCardData.dueToday++;
      if (diff < 0) projectCardData.overDue++;

      projectCardData.totalProjects++;
    }
  };

  const processBarChart = (tasks) => {
    for (const task of tasks) {
      const diff = getDiffDays(task.dueDate);

      if (task.completed) {
        barChartData.completed++;
      } else {
        barChartData.pending++;
        if (diff < 0) barChartData.overDue++;
      }
    }
  };

  const processLineChart = (tasks) => {
    for (const task of tasks) {
      if (task.completed && isInThisWeek(task.updatedAt)) {
        const day = getWeekdayName(task.updatedAt);
        lineChartData[day]++;
      }
    }
  };

  const processTodayFocus = (tasks) => {
    for (const task of tasks) {
      const diff = getDiffDays(task.dueDate);

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
    }
  };

  const processUpcoming = (tasks) => {
    for (const task of tasks) {
      const diff = getDiffDays(task.dueDate);

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
    }
  };

  const processCompleted = (tasks) => {
    for (const task of tasks) {
      const diff = getDiffDays(task.updatedAt);

      if ((task.completed && diff === 0) || (diff < 0 && diff > -4)) {
        completedData.push({
          name: task.title,
          type: task.type,
          date: new Date(task.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        });
      }
    }
  };

  // -------------------------
  // Main Execution
  // -------------------------

  try {
    const [allTasks, allProjects] = await Promise.all([
      tasksModel.find({ createdBy: userId }),
      projectsModel.find({ createdBy: userId }),
    ]);

    // Process all dashboard sections
    processBarChart(allTasks);
    processLineChart(allTasks);
    processTaskCards(allTasks);
    processTodayFocus(allTasks);
    processUpcoming(allTasks);
    processCompleted(allTasks);

    processProjectCards(allProjects);

    // Final Response
    res.status(200).json({
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
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({
      success: false,
      reply: "Internal Server Error",
    });
  }
};

export const exportData = async (req, res) => {
  const userId = req.user.id;
  try {
    const [tasks, projects] = await Promise.all([
      tasksModel
        .find({ createdBy: userId })
        .select("-_id -__v -createdBy -linkedProject -updatedAt")
        .lean(),
      projectsModel
        .find({ createdBy: userId })
        .select("-_id -__v -createdBy")
        .lean(),
      ,
    ]);
    res
      .status(200)
      .json({ reply: "Fetched", success: true, data: { tasks, projects } });
  } catch (err) {
    res.status(500).json({ reply: "Internal Server Error", success: false });
  }
};
