"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Plus, Search } from "lucide-react";
import clsx from "clsx";
import { useIsMobile } from "@/hooks/use-mobile";
import useTaskStore from "@/app/Store/task.store";

const Filter = () => {
  const [filter, setFilter] = useState("all");
  const [priority, setPriority] = useState("all");
  const [search, setSearch] = useState("");
  const [showFilters, setshowFilters] = useState(false);
  const isMobile = useIsMobile();
  const tasks = useTaskStore((state) => state.tasks);
  const setVisibleTasks = useTaskStore((state) => state.setVisibleTasks);
  useEffect(() => {
    if (tasks.length < 1) return;

    const filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filter === "all"
          ? true
          : filter === "completed"
          ? task.completed === true
          : filter === "in-progress"
          ? task.timer > 0 && task.completed === false
          : true;
      const priorityMap = {
        high: 1,
        medium: 2,
        low: 3,
      };
      const matchesPriority =
        priority === "all" ? true : task.priority === priorityMap[priority];

      return matchesSearch && matchesStatus && matchesPriority;
    });
    setVisibleTasks(filtered);
  }, [filter, priority, search, tasks]);

  return (
    <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-5 w-full">
      <div className="flex items-center justify-center bg-secondary lg:rounded-2xl rounded-none p-1 px-3 lg:w-1/2 w-full">
        <Search color="#93959a" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-secondary-foreground border-0 p-2 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Search for projects by title or description"
        />
      </div>
      <div
        className={clsx(
          "flex lg:px-0 overflow-hidden px-5 flex-col lg:flex-row items-center lg:items-center gap-5 w-full lg:w-auto justify-center transition-all duration-300 ease-in-out",
          {
            "max-h-0": isMobile && !showFilters,
            "max-h-[500px]": isMobile && showFilters,
            "lg:overflow-visible lg:max-h-none": true,
          }
        )}
      >
        <div className="flex flex-col relative gap-2 w-full lg:w-auto">
          <h3 className="text-sm font-medium text-gray-400 lg:absolute lg:-top-7">
            Status
          </h3>
          <div className="grid grid-cols-2 lg:flex lg:gap-2 place-items-center gap-3 lg:p-0">
            {["all", "completed", "in-progress"].map((item) => (
              <Button
                key={item}
                variant={filter === item ? "default" : "outline"}
                onClick={() => setFilter(item)}
                className="w-full lg:w-auto"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col relative gap-2 w-full lg:w-auto">
          <h3 className="text-sm font-medium text-gray-400 lg:absolute lg:-top-7">
            Priority
          </h3>
          <div className="grid grid-cols-2 lg:flex lg:gap-2 place-items-center gap-3 lg:p-0">
            {["all", "high", "medium", "low"].map((level) => (
              <Button
                key={level}
                variant={priority === level ? "default" : "outline"}
                onClick={() => setPriority(level)}
                className="w-full lg:w-auto"
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <p
        onClick={() => setshowFilters((prev) => !prev)}
        className="flex lg:hidden gap-2 items-center text-muted-foreground justify-center"
      >
        Filters{" "}
        <ChevronDown
          size={20}
          className={clsx(
            showFilters ? "rotate-180" : "rotate-0",
            "transition-all ease"
          )}
        />{" "}
      </p>
    </section>
  );
};

export default Filter;
