"use client"
import React from "react";
import Header from "./Header";
import Cards from "./Cards";
import Filter from "./Filter";

const Main = ({ data, filter }) => {
  return (
    <div className="md:p-10 w-full overflow-scroll">
      <Header />
      <Filter filter={filter} />
      <Cards data={data} />
    </div>
  );
};

export default Main;
