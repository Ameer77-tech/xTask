import React from "react";
import Header from "./Header";
import Filter from "./Filter";
import Cards from "./Cards";

const Main = ({ data, projectId }) => {
  return (
    <div className="md:p-10 p-5 w-full overflow-scroll">
      <Header
        title={data["payload"].projectTitle}
        desc={data["payload"].projectDescription}
        priority={data["payload"].projectPriority}
        projectId={projectId} 
      />
      <Filter/>
      <Cards />
    </div>
  );
};

export default Main;
