"use client";
import React, { useState, useEffect, useRef } from "react";
import TaskCard from "./Card";
import useTaskStore from "@/app/Store/task.store";
import ShowDialog from "@/components/Dialog";
import { AnimatePresence } from "motion/react";
import Toast from "@/components/Toast";
import Form from "./Form";
import { usePathname } from "next/navigation";

const apiUrl = `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/tasks`;

const AllTasks = () => {
  const pathName = usePathname();
  const allTasks = useTaskStore((state) => state.visibleTasks);
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
        setrunningTask("");
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
        setrunningTask("");
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

  /* TIMERRRRR LOGIC */
  const timerIntervalRef = useRef(null);
  const [runningTask, setrunningTask] = useState("");
  const updateTimer = useTaskStore((state) => state.updateTimer);

  const onPlay = (id) => {
    setrunningTask(id);
  };

  const onPause = async (id) => {
    await saveTimerToDB(id);
    setrunningTask("");
  };
  const onReset = async (id) => {
    updateTask(id, { timer: 0 });
    await updateTimerInDb(id, { timer: 0 });
    setrunningTask("");
  };
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };
  useEffect(() => {
    if (!runningTask) {
      clearInterval(timerIntervalRef.current);
      return;
    }
    // start interval
    timerIntervalRef.current = setInterval(() => {
      updateTimer(runningTask);
    }, 1000);
    // cleanup
    return () => clearInterval(timerIntervalRef.current);
  }, [runningTask]);

  useEffect(() => {
    if (pathName !== "/tasks") {
      if (runningTask) {
        saveTimerToDB(runningTask);
        setrunningTask("");
      }
    }
  }, [pathName]);

  useEffect(() => {
    const handleUnload = () => {
      if (!runningTask) return;
      const task = allTasks.find((t) => t._id === runningTask);
      if (!task) return;
      clearInterval(timerIntervalRef.current);
      setrunningTask("");
      saveTimerToDB(runningTask);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [runningTask, allTasks]);

  const saveTimerToDB = async (id) => {
    const task = allTasks.find((t) => t._id === id);
    if (!task) return;
    await updateTimerInDb(id, { timer: task.timer });
  };

  const updateTimerInDb = async (id, data) => {
    try {
      const response = await fetch(`${apiUrl}/edit-task/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (!res.success) console.log("Save failed:", res);
    } catch (err) {
      console.log("DB Save error:", err);
    }
  };

  /* TIMERRRRR LOGIC */

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
              onPlay={onPlay}
              onPause={onPause}
              onReset={onReset}
              setActionClicked={setActionClicked}
              setAction={setAction}
              setTaskDetails={setTaskDetails}
              key={task._id}
              task={task}
              runningTask={runningTask}
            />
          ))
        )}
      </section>
    </>
  );
};

export default AllTasks;
