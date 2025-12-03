import React from "react";
import DashboardCard from "./Card";
import ProgressCard from "./Progress";

const Cards = ({ data }) => {
  const tasksCardData = data.taskCardsData;
  const projectsCardData = data.projectCardData;
  return (
    <>
      <h1 className="text-center text-2xl font-bold tracking-wide text-primary">
        Personal Tasks Status
      </h1>
      <div className="p-5 lg:grid-cols-4 gap-5 md:grid-cols-3 grid-cols-1 grid place-items-center">
        <DashboardCard
          title={"OVER DUE"}
          count={tasksCardData.overDue}
          description="Overdue Tasks"
          trend="up"
        />
        <DashboardCard
          title={"DUE TODAY"}
          count={tasksCardData.dueToday}
          description="Tasks need to be done by today"
          trend="down"
        />
        <ProgressCard
          title="TODAY'S PROGRESS"
          completed={tasksCardData.todayCompleted}
          total={tasksCardData.todaysProgress}
        />
        <DashboardCard
          title={"PENDING"}
          count={tasksCardData.todayPending}
          description="Tasks not yet started"
        />
      </div>
      <h1 className="text-center text-2xl font-bold tracking-wide dark:text-accent">
        Projects Status
      </h1>
      <div className="p-5 lg:grid-cols-4 gap-5 md:grid-cols-3 grid-cols-1 grid place-items-center">
        <DashboardCard
          title={"OVER DUE"}
          count={projectsCardData.overDue}
          description="Overdue Tasks"
          trend="up"
        />
        <DashboardCard
          title={"DUE TODAY"}
          count={projectsCardData.dueToday}
          description="Tasks need to be done by today"
          trend="down"
        />

        <DashboardCard
          title={"TOTAL PROJECTS"}
          count={projectsCardData.totalProjects}
          description="Count Of Your Current Running Projects"
        />
        <DashboardCard
          title={"COMPLETED PROJECTS"}
          count={projectsCardData.completed}
          description="Your Completed Projects"
        />
      </div>
    </>
  );
};

export default Cards;
