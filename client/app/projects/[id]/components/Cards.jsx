"use client";
import React, { useState, useEffect } from "react";
import TaskCard from "./Card";
import useTaskStore from "@/app/Store/task.store";

const AllTasks = ({ projectId }) => {
  const allTasks = useTaskStore((state) => state.tasks);

  return (
    <section className="grid gap-4 sm:grid-cols-2 mt-5 lg:grid-cols-3">
      {allTasks.length < 1 ? (
        <p className="text-center mt-10 text-muted-foreground lg:col-span-3">No Tasks</p>
      ) : (
        allTasks.map((task) => <TaskCard key={task._id} task={task} />)
      )}
    </section>
  );
};

export default AllTasks;
