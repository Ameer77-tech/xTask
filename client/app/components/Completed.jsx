// src/components/Completed.jsx

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCheck } from "lucide-react"; // Using a "done" icon

// --- Mock Data (Replace with your API data) ---
// We need dates for when tasks were completed
const mockTasks = [
  {
    id: 1,
    title: "Send invoice to client",
    project: "Admin",
    completedAt: "2025-11-12T14:30:00.000Z", // Today
  },
  {
    id: 2,
    title: "Review PR #115",
    project: "Tech",
    completedAt: "2025-11-12T10:15:00.000Z", // Today
  },
  {
    id: 3,
    title: "Finalize Q4 report slides",
    project: "Project Phoenix",
    completedAt: "2025-11-11T16:00:00.000Z", // Yesterday
  },
  {
    id: 4,
    title: "Buy groceries",
    project: null,
    type: "personal",
    completedAt: "2025-11-11T18:00:00.000Z", // Yesterday
  },
  {
    id: 5,
    title: "Onboard new marketing hire",
    project: "Marketing",
    completedAt: "2025-11-08T11:00:00.000Z", // Last week
  },
];
// --- End Mock Data ---

// --- Date Grouping Logic ---

/**
 * Groups tasks by formatted completion date.
 */
const groupTasksByDate = (tasks) => {
  const groups = {};
  const today = new Date("2025-11-12T12:00:00.000Z"); // Using a fixed "today" for consistent mock data
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Formatter for other dates (e.g., "Saturday, Nov 8")
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  for (const task of tasks) {
    const completedDate = new Date(task.completedAt);
    let groupName = "";

    // Check if it's today
    if (
      completedDate.getDate() === today.getDate() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getFullYear() === today.getFullYear()
    ) {
      groupName = "Today, Nov 12";
    }
    // Check if it's yesterday
    else if (
      completedDate.getDate() === yesterday.getDate() &&
      completedDate.getMonth() === yesterday.getMonth() &&
      completedDate.getFullYear() === yesterday.getFullYear()
    ) {
      groupName = "Yesterday, Nov 11";
    }
    // All other dates
    else {
      groupName = dateFormatter.format(completedDate); // e.g., "Saturday, Nov 8"
    }

    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(task);
  }

  // Sort the groups by date (most recent first)
  const sortedGroupTuples = Object.entries(groups).sort((a, b) => {
    // We can just sort by the completion date of the first task in each group
    return new Date(b[1][0].completedAt) - new Date(a[1][0].completedAt);
  });

  return new Map(sortedGroupTuples); // Use Map to preserve insertion order
};
// --- End Date Grouping Logic ---

const Completed = () => {
  const groupedTasks = groupTasksByDate(mockTasks);

  return (
    <Card className="bg-secondary border-0 h-full">
      <CardHeader>
        <CardTitle>Completed</CardTitle>
        <CardDescription>What you've finished</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4"> {/* Adjust height as needed */}
          <div className="flex flex-col gap-4">
            {groupedTasks.size > 0 ? (
              Array.from(groupedTasks.entries()).map(([dateGroup, tasks]) => (
                <div key={dateGroup}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {dateGroup}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 bg-background rounded-lg opacity-70" // Slightly faded out
                      >
                        <CheckCheck
                          size={20}
                          className="text-emerald-500 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="font-medium line-through">
                            {task.title}
                          </p>
                          {task.project && (
                            <Badge variant="outline" className="mt-1">
                              {task.project}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4 bg-background" />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-10">
                No completed tasks yet.
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Completed;