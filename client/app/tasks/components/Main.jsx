"use client"
import Header from "./Header";
import Filter from "./Filter";
import Tasks from "./Tasks";

const Main = ({ filter, view }) => {
  return (
      <div className="md:p-20 w-full overflow-scroll">
        <Header view={view} />
        <Filter filter={filter} currentView={view} />
        <Tasks view={view} filter={filter} />
      </div>
  );
};

export default Main;
