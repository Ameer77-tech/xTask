import React from "react";
import TodaysFocus from "./TodaysFocus";
import Upcoming from "./Upcoming";
import Completed from "./Completed";

const MainContent = ({ data }) => {
  const todays
  return (
    <div className="p-5 lg:grid-cols-2 grid-cols-1 grid gap-2">
      <TodaysFocus />
      <div className="flex flex-col gap-2">
        <Upcoming />
        <Completed />
      </div>
    </div>
  );
};

export default MainContent;
