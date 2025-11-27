"use client";
import React, { useState, useEffect } from "react";
import TaskCard from "./Card";
import useTaskStore from "@/app/Store/task.store";
import ShowDialog from "@/components/Dialog";

const AllTasks = () => {
  const allTasks = useTaskStore((state) => state.tasks);
  const [editingTask, setEditingTask] = useState("");
  const [actionClicked, setActionClicked] = useState(false);
  const [action, setAction] = useState("");
  const [editingForm, seteditingForm] = useState(false);
  const [isPending, setisPending] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    id: "",
  });

  const onDelete = (id) => {};

  const onEdit = (id) => {};

  const onMark = (id) => {};

  return (
    <>
      {actionClicked && (
        <ShowDialog
          Data={taskDetails}
          setActionClicked={setActionClicked}
          onDelete={onDelete}
          action={action}
          seteditingTask={setEditingTask}
          onMark={onMark}
          isPending={isPending}
          setEditingForm={seteditingForm}
        />
      )}

      <section className="grid gap-4 sm:grid-cols-2 mt-5 lg:grid-cols-3">
        {allTasks.length < 1 ? (
          <p className="text-center mt-10 text-muted-foreground lg:col-span-3">
            No Tasks
          </p>
        ) : (
          allTasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </section>
    </>
  );
};

export default AllTasks;
