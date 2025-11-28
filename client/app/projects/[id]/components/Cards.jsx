"use client";
import React, { useState, useEffect } from "react";
import TaskCard from "./Card";
import useTaskStore from "@/app/Store/task.store";
import ShowDialog from "@/components/Dialog";
import { AnimatePresence } from "motion/react";
import Toast from "@/components/Toast";
import Form from "./Form";

const apiUrl = `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/tasks`;

const AllTasks = () => {
  const allTasks = useTaskStore((state) => state.tasks);
  const removeTask = useTaskStore((state) => state.removeTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [editingTask, setEditingTask] = useState("");
  const [actionClicked, setActionClicked] = useState(false);
  const [action, setAction] = useState("");
  const [editingForm, seteditingForm] = useState(false);
  const [isPending, setisPending] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    id: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({
    message: "",
    type: "",
    isSuccess: false,
  });
  const [initialDetails, setInitialDetails] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: 2,
    type: "project",
    linkedProject: null,
  });
  const onDelete = async (id) => {
    if (!id || id === "") {
      return;
    }
    setisPending(true);
    try {
      const response = await fetch(`${apiUrl}/delete-task/${id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      });
      const res = await response.json();
      if (!res.success) {
        setShowToast(true);
        setToastData({ message: res.reply, type: "error", isSuccess: false });
      } else {
        setShowToast(true);
        setToastData({ message: res.reply, type: "success", isSuccess: true });
        removeTask(res.deleted._id);
        setActionClicked(false);
      }
    } catch (err) {
      setShowToast(true);
      setToastData({ message: err.data, type: "error", isSuccess: false });
      console.log(err);
    } finally {
      setisPending(false);
      setTimeout(() => {
        setToastData({ message: "", type: "", isSuccess: false });
        setShowToast(false);
      }, 2000);
    }
  };

  const onMark = async (id) => {
    if (!id || id === "") {
      return;
    }
    setisPending(true);
    try {
      const response = await fetch(`${apiUrl}/edit-task/${id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ completed: true }),
        credentials: "include",
      });
      const res = await response.json();
      console.log(res);

      if (!res.success) {
        setShowToast(true);
        setToastData({ message: res.reply, type: "error", isSuccess: false });
      } else {
        setShowToast(true);
        setToastData({ message: res.reply, type: "success", isSuccess: true });
        updateTask(res.updatedTask._id, res.updatedTask);
        setActionClicked(false);
      }
    } catch (err) {
      setShowToast(true);
      setToastData({ message: err.data, type: "error", isSuccess: false });
      console.log(err);
    } finally {
      setisPending(false);
      setTimeout(() => {
        setToastData({ message: "", type: "", isSuccess: false });
        setShowToast(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (editingTask !== "") {
      const theTask = allTasks.filter((task) => {
        if (task._id === editingTask) {
          return {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            type: "project",
            linkedProject: task.linkedProject,
          };
        }
      });
      setInitialDetails(...theTask);
    }
  }, [editingTask]);

  console.log(initialDetails);

  return (
    <>
      <AnimatePresence>
        {editingForm && (
          <Form
            editingTask={editingTask}
            initialTaskDetails={initialDetails}
            setIsOpen={seteditingForm}
            id={editingTask}
            setActionClicked={setActionClicked}
            seteditingTask={setEditingTask}
          />
        )}
      </AnimatePresence>
      <Toast show={showToast} toastData={toastData} />
      <AnimatePresence>
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
      </AnimatePresence>

      <section className="grid gap-4 sm:grid-cols-2 mt-5 lg:grid-cols-3">
        {allTasks.length < 1 ? (
          <p className="text-center mt-10 text-muted-foreground lg:col-span-3">
            No Tasks
          </p>
        ) : (
          allTasks.map((task) => (
            <TaskCard
              setActionClicked={setActionClicked}
              setAction={setAction}
              setTaskDetails={setTaskDetails}
              key={task._id}
              task={task}
            />
          ))
        )}
      </section>
    </>
  );
};

export default AllTasks;
