import React from "react";
import TodaysFocus from "./TodaysFocus";
import Upcoming from "./Upcoming";
import Completed from "./Completed";

const MainContent = ({ data }) => {
  const todaysFocus = data.todaysFocusData;
  const upcoming = data.upcoming;
  const completed = data.completed;
  return (
    <div className="p-5 lg:grid-cols-2 grid-cols-1 grid gap-2">
      <TodaysFocus data={todaysFocus} />
      <div className="flex flex-col gap-2">
        <Upcoming data={upcoming} />
        <Completed data={completed} />
      </div>
    </div>
  );
};

export default MainContent;
