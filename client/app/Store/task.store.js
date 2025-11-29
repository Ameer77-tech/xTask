"use client";
import { create } from "zustand";

const useTaskStore = create((set) => ({
  tasks: [],
  visibleTasks: [],
  isLoading: true,
  setLoading: (val) => set((state) => ({ isLoading: val })),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
      visibleTasks: [...state.tasks, task],
    })),
  removeTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== taskId),
      visibleTasks: state.tasks.filter((task) => task._id !== taskId),
    }));
  },
  updateTask: (taskId, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === taskId ? { ...task, ...updatedTask } : task
      ),
      visibleTasks: state.tasks.map((task) =>
        task._id === taskId ? { ...task, ...updatedTask } : task
      ),
    })),
  updateTimer: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === taskId ? { ...task, timer: task.timer + 1 } : task
      ),
      visibleTasks: state.tasks.map((task) =>
        task._id === taskId ? { ...task, timer: task.timer + 1 } : task
      ),
    })),
  setTasks: (Tasks) => set({ tasks: Tasks.tasks, visibleTasks: Tasks.tasks }),

  setVisibleTasks: (list) => set({ visibleTasks: list }),
  clearTasks: () => set({ tasks: [] }),
}));

export default useTaskStore;
