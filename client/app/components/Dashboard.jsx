import React from "react";
import Header from "./Header";
import Cards from "./Cards";
import Charts from "./Charts";
import MainContent from "./MainContent";

const Dashboard = ({ data }) => {
  const cardsData = {
    taskCardsData: data.dashboardData.taskCardData,
    projectCardData: data.dashboardData.projectCardData,
  };
  const chartsData = {
    barChart: data.dashboardData.barChartData,
    lineChart: data.dashboardData.lineChartData,
  };
  const mainContentData = {
    todaysFocusData: data.dashboardData.todaysFocusData,
    upcoming: data.dashboardData.upcomingData,
    completed: data.dashboardData.completedData,
  };

  return (
    <div className="w-full">
      <Header />
      <Cards data={cardsData} />
      <Charts data={chartsData} />
      <MainContent data={mainContentData} />
    </div>
  );
};

export default Dashboard;
