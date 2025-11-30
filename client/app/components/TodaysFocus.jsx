// src/components/TodaysFocus.jsx
"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
const mockTasks = [
  {
    id: 1,
    title: "Finalize Q4 report",
    priority: "high",
    type: "project",
    project: "Project Phoenix",
    status: "Overdue (Nov 11)",
  },
  {
    id: 2,
    title: "Call new client",
    priority: "high",
    type: "project",
    project: "Sales",
    status: "Today",
  },
  {
    id: 3,
    title: "Draft email campaign",
    priority: "medium",
    type: "project",
    project: "Marketing",
    status: "Today",
  },
  {
    id: 4,
    title: "Water the office plant",
    priority: "low",
    type: "personal",
    project: null,
    status: "Today",
  },
  {
    id: 5,
    title: "Pick up dry cleaning",
    priority: "low",
    type: "personal",
    project: null,
    status: "Today",
  },
  {
    id: 6,
    title: "Review PR #117",
    priority: "medium",
    type: "project",
    project: "Tech",
    status: "Today",
  },
];

const mockProjects = ["Project Phoenix", "Sales", "Marketing", "Tech", "Admin"];
// --- End Mock Data ---

// Helper function to get badge color based on priority
const getPriorityBadgeVariant = (priority) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

const TodaysFocus = () => {
  // --- State for Filters ---
  const [typeFilter, setTypeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // --- Filtering Logic ---
  const filteredTasks = mockTasks
    .filter((task) => {
      // Type Filter (Personal / Project)
      return typeFilter === "all" || task.type === typeFilter;
    })
    .filter((task) => {
      // Project Filter
      return projectFilter === "all" || task.project === projectFilter;
    })
    .filter((task) => {
      // Priority Filter
      return priorityFilter === "all" || task.priority === priorityFilter;
    });

  return (
    <Card className="bg-secondary border-0 h-full">
      <CardHeader className={"px-6 grid-cols-1 place-items-start"}>
        <div className="space-y-5">
          <div>
            <CardTitle>Today's Focus</CardTitle>
            <CardDescription>Tasks due or overdue</CardDescription>
          </div>

          {/* --- Filter Section --- */}
          <div className="flex flex-wrap md:flex-row gap-2 mt-4 md:mt-0">
            {/* Project Filter */}
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {mockProjects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[130px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[130px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      {/* --- Task List Section --- */}
      <CardContent>
        <ScrollArea className="max-h-[900px] overflow-scroll pr-4">
          {" "}
          {/* Adjust height as needed */}
          <div className="flex flex-col gap-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-background rounded-lg"
                >
                  <Checkbox id={`task-${task.id}`} />
                  <div className="flex-1">
                    <label
                      htmlFor={`task-${task.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {task.title}
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={getPriorityBadgeVariant(task.priority)}
                        className="capitalize"
                      >
                        {task.priority}
                      </Badge>
                      {task.project && (
                        <Badge variant="outline">{task.project}</Badge>
                      )}
                      <span
                        className={`text-xs ${
                          task.status.includes("Overdue")
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-10">
                No tasks match your filters.
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TodaysFocus;
