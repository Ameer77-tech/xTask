import React from "react";
import DashboardCard from "./Card";
import ProgressCard from "./Progress";

const Cards = () => {
  return (
    <>
      <h1 className="text-center text-2xl font-bold tracking-wide text-primary">Tasks Status</h1>
      <div className="p-5 lg:grid-cols-4 gap-5 md:grid-cols-3 grid-cols-1 grid place-items-center">
        <DashboardCard
          title={"OVER DUE"}
          count={120}
          description="Overdue Tasks"
          trend="up"
        />
        <DashboardCard
          title={"DUE TODAY"}
          count={120}
          description="Tasks need to be done by today"
          trend="down"
        />
        <ProgressCard title="TODAY'S PROGRESS" completed={2} total={10} />
        <DashboardCard
          title={"PENDING"}
          count={15}
          description="Tasks not yet started"
        />
      </div>
       <h1 className="text-center text-2xl font-bold tracking-wide text-accent">Projects Status</h1>
       <div className="p-5 lg:grid-cols-3 gap-5 md:grid-cols-3 grid-cols-1 grid place-items-center">
        <DashboardCard
          title={"OVER DUE"}
          count={120}
          description="Overdue Tasks"
          trend="up"
        />
        <DashboardCard
          title={"DUE TODAY"}
          count={120}
          description="Tasks need to be done by today"
          trend="down"
        />
       
        <DashboardCard
          title={"TOTAL PROJECTS"}
          count={15}
          description="Count Of Your Current Running Projects"
        />
      </div>
    </>
  );
};

export default Cards;
