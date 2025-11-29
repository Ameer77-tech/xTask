"use client";
import { useEffect } from "react";
import useTaskStore from "../Store/task.store";

const TasksInitializer = ({ taskData }) => {
  const setTasks = useTaskStore((state) => state.setTasks);
  const setLoading = useTaskStore((state) => state.setLoading);

  useEffect(() => {
    setTasks({ tasks: taskData });
    setLoading(false);
  }, [taskData, setTasks]);

  return null;
};

export default TasksInitializer;
