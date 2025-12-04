"use client";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Search } from "lucide-react";
import Link from "next/link";
import AddTaskBtn from "./AddTaskBtn";
import { useEffect, useState } from "react";
import useTaskStore from "@/app/Store/task.store";

export default function Filter({ filter, currentView }) {
  const filters = ["All", "Completed", "In-progress"];
  const tasks = useTaskStore((state) => state.tasks);
  const setVisibleTasks = useTaskStore((state) => state.setVisibleTasks);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (tasks.length < 1) return;

    const filtered = tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setVisibleTasks(filtered);
  }, [searchTerm, tasks]);

  return (
    <div className="md:flex md:flex-row flex-col md:justify-between px-3 md:mt-0 mt-5">
      <div className="md:w-1/2 w-full flex items-center gap-2 bg-secondary rounded-2xl p-1 px-3">
        <Search color="#93959a" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-secondary-foreground dark:bg-secondary border-0 p-2"
          placeholder="Search for tasks by title or description"
        />
      </div>

      <div className="md:flex gap-2 items-center grid grid-cols-2 md:mt-0 mt-5 place-items-center">
        {filters.map((name, idx) => {
          const params = new URLSearchParams();
          params.set("filter", name.toLowerCase());
          if (currentView) params.set("view", currentView);

          return (
            <Link
              key={idx}
              href={`/tasks?${params.toString()}`}
              className={clsx(
                "select-none shadow-sm md:w-auto w-full shadow-muted-foreground/20 rounded-2xl px-3 py-2 cursor-pointer",
                filter === name.toLowerCase()
                  ? "bg-accent text-black"
                  : "bg-secondary"
              )}
            >
              {name}
            </Link>
          );
        })}
        <AddTaskBtn />
      </div>
    </div>
  );
}
