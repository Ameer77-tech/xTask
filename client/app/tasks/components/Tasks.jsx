"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Task from "./Task";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MobileTask from "./MobileTask";
import clsx from "clsx";
import useTaskStore from "@/app/Store/task.store";
import ShowDialog from "../../../components/Dialog";
import { AnimatePresence } from "motion/react";
import Toast from "@/components/Toast";
import Loading from "@/components/Loading";
import { Spinner } from "@/components/ui/spinner";
import AddTaskForm from "./AddTaskForm";
import { usePathname } from "next/navigation";

const Tasks = ({ view, filter }) => {
  const visibleTasks = useTaskStore((state) => state.visibleTasks);
  const tasks = useMemo(
    () => visibleTasks.filter((t) => t.type === "personal"),
    [visibleTasks]
  );
  const isLoading = useTaskStore((state) => state.isLoading);
  const pathName = usePathname();

  const allTasks = useMemo(() => {
    return [...(tasks || [])].sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;

      const pa = Number(a.priority ?? 99);
      const pb = Number(b.priority ?? 99);
      if (pa !== pb) return pa - pb;

      const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return da - db;
    });
  }, [tasks]);
  const removeTask = useTaskStore((state) => state.removeTask);
  const editTask = useTaskStore((state) => state.updateTask);
  const [toastData, settoastData] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [initialDetails, setInitialDetails] = useState({});
  const [editingForm, setEditingForm] = useState(false);
  const [actionClicked, setActionClicked] = useState(false);
  const [isPending, setisPending] = useState(false);
  const [action, setaction] = useState("");
  const [editingTask, seteditingTask] = useState("");
  const [taskData, settaskData] = useState({
    text: "",
    id: "",
  });

  useEffect(() => {
    tasks.forEach((task, idx) => {
      if (task._id === editingTask) {
        setInitialDetails(task);
      }
    });
  }, [editingTask]);

  const apiUrl = `${process.env.NEXT_PUBLIC_XTASK_FRONTEND}/api/task`;
  const onDelete = async () => {
    setisPending(true);
    try {
      const response = await fetch(`${apiUrl}/remove/${taskData.id}`, {
        method: "DELETE",
        header: {
          "content-type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();

      if (!data.success) {
        settoastData({
          show: true,
          message: data.reply,
          type: "error",
        });
        setTimeout(() => {
          settoastData({
            show: false,
            message: "",
            type: "",
          });
        }, 2000);
      } else {
        settoastData({
          show: true,
          message: data.reply,
          type: "success",
        });
        removeTask(data.deleted._id);
        setTimeout(() => {
          settoastData({
            show: false,
            message: "",
            type: "",
          });
        }, 2000);
        setActionClicked(false);
      }
    } catch (err) {
      settoastData({
        show: true,
        message: err.data,
        type: "error",
      });
    } finally {
      setisPending(false);
      setActionClicked(false);
    }
  };

  const onMark = async () => {
    setisPending(true);
    try {
      const response = await fetch(`${apiUrl}/update/${taskData.id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
          completed: true,
          completedAt: new Date(),
        }),
        credentials: "include",
      });
      const data = await response.json();
      if (!data.success) {
        settoastData({
          show: true,
          message: data.reply,
          type: "error",
        });
        setTimeout(() => {
          settoastData({
            show: false,
            message: "",
            type: "",
          });
        }, 2000);
      } else {
        settoastData({
          show: true,
          message: data.reply,
          type: "success",
        });
        editTask(data.updatedTask._id, {
          status: "completed",
          comlpetedAt: new Date(),
        });
        setTimeout(() => {
          settoastData({
            show: false,
            message: "",
            type: "",
          });
        }, 2000);
        setActionClicked(false);
      }
    } catch (err) {
      settoastData({
        show: true,
        message: "An Error occured",
        type: "error",
      });
    } finally {
      setisPending(false);
      setActionClicked(false);
    }
  };

  /* TIMERRRRR LOGIC */
  const timerIntervalRef = useRef(null);
  const [runningTask, setrunningTask] = useState("");
  const updateTimer = useTaskStore((state) => state.updateTimer);

  const onPlay = (id) => {
    setrunningTask(id);
  };

  const onPause = async (id) => {
    setrunningTask("");
    await saveTimerToDB(id);
  };
  const onReset = async (id) => {
    editTask(id, { timer: 0 });
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
      const task = tasks.find((t) => t._id === runningTask);
      if (!task) return;
      clearInterval(timerIntervalRef.current);
      setrunningTask("");
      saveTimerToDB(runningTask);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [runningTask, tasks]);

  const saveTimerToDB = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    await updateTimerInDb(id, { timer: task.timer });
  };

  const updateTimerInDb = async (id, data) => {
    try {
      const response = await fetch(`${apiUrl}/update/${id}`, {
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
      <Toast toastData={toastData} show={toastData.show} />
      {editingForm && (
        <AddTaskForm
          setActionClicked={setActionClicked}
          initialTaskDetails={initialDetails}
          isOpen={editingForm}
          editingTask={editingTask}
          seteditingTask={seteditingTask}
          setIsOpen={setEditingForm}
        />
      )}

      <AnimatePresence>
        {actionClicked && (
          <ShowDialog
            Data={taskData}
            onDelete={onDelete}
            action={action}
            setActionClicked={setActionClicked}
            onMark={onMark}
            isPending={isPending}
            seteditingTask={seteditingTask}
            setEditingForm={setEditingForm}
          />
        )}
      </AnimatePresence>

      <div className="mt-2 rounded-2xl overflow-hidden">
        {/* PC */}
        <Table
          className={clsx(
            "overflow-visible",
            view == "list" ? "hidden md:inline-table" : "md:hidden"
          )}
        >
          <TableCaption className={"mb-3 capitalize"}>
            {filter} Tasks
          </TableCaption>
          <TableHeader className={"bg-gray-600/30 text-center select-none"}>
            <TableRow className={"select-none"}>
              <TableHead className={"md:w-[300px] pl-5"}>Task</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Timer</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={"bg-secondary overflow-visible"}>
            <AnimatePresence>
              {isLoading ? (
                <TableRow className="text-muted-foreground bg-background h-50">
                  <TableCell className="text-center" colSpan={5}>
                    <Spinner
                      className={"size-5 absolute left-1/2 -translate-x-1/2"}
                    />
                  </TableCell>
                </TableRow>
              ) : allTasks.length < 1 ? (
                <TableRow className="text-muted-foreground bg-background h-50">
                  <TableCell className="text-center" colSpan={5}>
                    NO TASKS
                  </TableCell>
                </TableRow>
              ) : (
                allTasks.map(
                  (task, idx) =>
                    task.type === "personal" && (
                      <Task
                        filter={filter}
                        status={task.status}
                        key={task._id}
                        id={task._id}
                        index={idx}
                        name={task.title}
                        desc={task.description}
                        priority={task.priority}
                        timer={task.timer}
                        formatTime={formatTime}
                        due={task.dueDate}
                        setActionClicked={setActionClicked}
                        settaskData={settaskData}
                        setaction={setaction}
                        runningTask={runningTask}
                        onPlay={onPlay}
                        onPause={onPause}
                        onReset={onReset}
                      />
                    )
                )
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
        {/* PC */}
        {/* Mobile */}
        <div
          className={clsx(
            "flex flex-col gap-5 p-5",
            view == "grid" ? "md:grid md:grid-cols-3" : "md:hidden"
          )}
        >
          {isLoading ? (
            <div className="flex w-full mt-20 justify-center">
              <Spinner className={"text-primary size-5"} />
            </div>
          ) : allTasks.length < 1 ? (
            <p className="text-center text-muted-foreground">NO TASKS</p>
          ) : (
            allTasks.map((task, idx) => (
              <MobileTask
                filter={filter}
                status={task.status}
                key={task._id}
                id={task._id}
                index={idx}
                name={task.title}
                desc={task.description}
                priority={task.priority}
                timer={task.timer}
                formatTime={formatTime}
                due={task.dueDate}
                setActionClicked={setActionClicked}
                settaskData={settaskData}
                setaction={setaction}
                runningTask={runningTask}
                onPlay={onPlay}
                onPause={onPause}
                onReset={onReset}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Tasks;
