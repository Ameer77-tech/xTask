"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Toast from "@/components/Toast";
import useTaskStore from "@/app/Store/task.store";
import { Spinner } from "@/components/ui/spinner";

const apiUrl = `${process.env.NEXT_PUBLIC_XTASK_FRONTEND}/api/task`;
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    return dateString.substring(0, 10);
  } catch (e) {
    console.error("Failed to format date:", e);
    return "";
  }
};

const AddTaskForm = ({
  isOpen,
  setIsOpen,
  initialTaskDetails,
  editingTask,
  setActionClicked,
  seteditingTask,
}) => {
  const defaultTaskState = {
    title: "",
    description: "",
    dueDate: "",
    priority: 2,
    type: "personal",
    linkedProject: null,
  };
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [isPending, setisPending] = useState(false);

  const buildFormState = (initialData) => {
    if (initialData) {
      return {
        ...defaultTaskState,
        ...initialData,

        priority: Number(initialData.priority) || defaultTaskState.priority,
        dueDate: formatDateForInput(initialData.dueDate),
      };
    }
    return defaultTaskState;
  };
  const [taskDetails, setTaskDetails] = useState(() =>
    buildFormState(
      initialTaskDetails === undefined ? defaultTaskState : initialTaskDetails
    )
  );

  useEffect(() => {
    setTaskDetails(buildFormState(initialTaskDetails));
  }, [initialTaskDetails, editingTask]);

  const [toastData, setToastData] = useState({
    message: "",
    type: "",
    isSuccess: false,
  });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [setIsOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...taskDetails, priority: Number(taskDetails.priority) };
    setisPending(true);
    try {
      const response = await fetch(`${apiUrl}/add`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!data.success) {
        setToastData({
          message: data.reply,
          type: "error",
          isSuccess: false,
        });
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      } else {
        addTask(data.created);
        setToastData({
          message: data.reply,
          type: "success",
          isSuccess: true,
        });
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      }
    } catch (err) {
      console.log(err);
      setShowToast(true);
      setToastData({
        message: err,
        type: "error",
        isSuccess: false,
      });
    } finally {
      setIsOpen(false);
      setTaskDetails(buildFormState(initialTaskDetails ?? defaultTaskState));
      setisPending(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const payload = { ...taskDetails, priority: Number(taskDetails.priority) };
    setisPending(true);
    try {
      const response = await fetch(`${apiUrl}/update/${editingTask}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!data.success) {
        setToastData({
          message: data.reply,
          type: "error",
          isSuccess: false,
        });
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      } else {
        updateTask(data.updatedTask._id, data.updatedTask);
        setToastData({
          message: data.reply,
          type: "success",
          isSuccess: true,
        });
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      }
    } catch (err) {
      console.log(err);
      setShowToast(true);
      setToastData({
        message: err,
        type: "error",
        isSuccess: false,
      });
    } finally {
      setTaskDetails(buildFormState(initialTaskDetails));
      setisPending(false);
      setActionClicked(false);
      seteditingTask("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (value) => {
    if (value === "") {
      setTaskDetails((prev) => ({
        ...prev,
        priority: Number(taskDetails.priority),
      }));
    } else setTaskDetails((prev) => ({ ...prev, priority: Number(value) }));
  };

  return (
    <>
      <Toast key="toast" show={showToast} toastData={toastData} />
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-full max-w-md bg-secondary p-6 shadow-2xl rounded-xl relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold mb-2 text-center">
                  {editingTask === undefined ? (
                    <p>🚀 Create New Task </p>
                  ) : (
                    <p>Edit Task</p>
                  )}
                </h2>
                <p className="text-center text-gray-500 mb-6">
                  {editingTask === undefined ? (
                    <span>Enter the details for your new task below.</span>
                  ) : (
                    <span> Edit the Details of Your Tasks </span>
                  )}
                </p>
                <form
                  onSubmit={
                    editingTask === undefined ? handleSubmit : handleEdit
                  }
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={taskDetails.title}
                      onChange={handleChange}
                      placeholder="e.g., Finalize Q3 Budget"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={taskDetails.description}
                      onChange={handleChange}
                      placeholder="Detailed notes or requirements..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      required
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={taskDetails.dueDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={String(taskDetails.priority)}
                      onValueChange={(value) => handlePriorityChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">High</SelectItem>
                        <SelectItem value="2">Medium</SelectItem>
                        <SelectItem value="3">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {isPending ? (
                    <Button disabled size="sm" className={"w-full"}>
                      <Spinner className={"size-2"} />
                      {editingTask === undefined ? (
                        <p>Add Task</p>
                      ) : (
                        <p>Edit Task</p>
                      )}
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full">
                      {editingTask === undefined ? (
                        <p>Add Task</p>
                      ) : (
                        <p>Edit Task</p>
                      )}
                    </Button>
                  )}
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddTaskForm;
