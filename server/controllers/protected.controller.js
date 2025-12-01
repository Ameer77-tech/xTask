import userModel from "../models/user.model.js";
import tasksModel from "../models/task.model.js";
import projectModel from "../models/project.model.js";

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

export const getDashboardData = async (req, res) => {
  /* CARDS */
  //overdue tasks and projects
  //due toady tasks and projects
  // todays's progress of tasks
  // pending today tasks
  // total projects count
  /* CHARTS */
  //all completed,pending, overdue tasks
  //tasks completed every day over the week
  // todays and 2 days overdue tasks from personal and projects
  // upcoming tasks from projects and tasks upto 3 days
  // completed tasks today from projects and tasks over a week

  const userId = req.user.id;
  function normalize(d) {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  }
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

  function getWeekdayName(date) {
    const weekMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekMap[new Date(date).getDay()];
  }

  function getCurrentWeekRange() {
    const today = normalize(new Date());

    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  }
  function isInThisWeek(dateToCheck) {
    const { monday, sunday } = getCurrentWeekRange();
    const d = normalize(dateToCheck);
    return d >= monday && d <= sunday;
  }
  const getTaskCardData = (allTasks) =>
    allTasks
      .filter((task, idx) => task.type === "personal")
      .forEach((task, idx) => {
        let dbDate = normalize(task.dueDate);
        let today = normalize(new Date());
        let diffDays = (dbDate - today) / (1000 * 60 * 60 * 24);
        if (diffDays === 0) {
          taskCardData.dueToday++;
          if (task.completed) {
            taskCardData.todayCompleted++;
          } else {
            taskCardData.todayPending++;
          }
        }
        if (diffDays < 0) {
          taskCardData.overDue++;
        }
      });
  const getProjectCardData = (allProjects) =>
    allProjects.forEach((project, idx) => {
      let dbDate = normalize(project.dueDate);
      let today = normalize(new Date());
      let diffDays = (dbDate - today) / (1000 * 60 * 60 * 24);
      if (diffDays === 0) {
        projectCardData.dueToday++;
      }
      if (diffDays < 0) {
        projectCardData.overDue++;
      }
      projectCardData.totalProjects++;
    });
  const getBarChartData = (allTasks) => {
    allTasks.forEach((task) => {
      let dbDate = normalize(task.dueDate);
      let today = normalize(new Date());
      let diffDays = (dbDate - today) / (1000 * 60 * 60 * 24);
      if (task.completed) {
        barChartData.completed++;
      } else {
        if (!task.completed) {
          barChartData.pending++;
        }
        if (diffDays < 0 && !task.completed) {
          barChartData.overDue++;
        }
      }
    });
  };
  const getLineChartData = (allTasks) => {
    allTasks.forEach((task) => {
      if (isInThisWeek(task.updatedAt) && task.completed) {
        const dayName = getWeekdayName(task.updatedAt);
        lineChartData[dayName]++;
      }
    });
  };

  try {
    const allTasks = await tasksModel.find({ createdBy: userId });
    getBarChartData(allTasks);
    getLineChartData(allTasks);
    console.log(lineChartData);

    getTaskCardData(allTasks);
    try {
      const allProjects = await projectModel.find({ createdBy: userId });
      getProjectCardData(allProjects);
    } catch (err) {
      res
        .status(500)
        .json({ reply: "Internal Server Error in Projects", success: false });
    }
    res.status(200).json(allTasks);
  } catch (err) {
    res.status(500).json({ reply: "Internal Server Error", success: false });
  }
};
