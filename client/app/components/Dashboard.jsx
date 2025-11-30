import React from "react";
import Header from "./Header";
import Cards from "./Cards";
import Charts from "./Charts";
import MainContent from "./MainContent";

const Dashboard = () => {
  return (
    <div className="w-full">
      <Header />
      <Cards />
      <Charts />
      <MainContent />
    </div>
  );
};

export default Dashboard;
