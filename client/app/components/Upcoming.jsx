// src/components/Upcoming.jsx

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// --- Mock Data (Replace with your API data) ---
// We need future dates for this component
const mockTasks = [
  {
    id: 1,
    title: "Prepare presentation slides",
    project: "Project Phoenix",
    dueDate: "2025-11-13T10:00:00.000Z", // Tomorrow
  },
  {
    id: 2,
    title: "Send out team invites",
    project: "Marketing",
    dueDate: "2025-11-13T14:00:00.000Z", // Tomorrow
  },
  {
    id: 3,
    title: "Book flight for conference",
    project: "Admin",
    dueDate: "2025-11-14T09:00:00.000Z", // Friday
  },
  {
    id: 4,
    title: "Pay monthly server bill",
    project: "Tech",
    dueDate: "2025-11-15T12:00:00.000Z", // Saturday
  },
  {
    id: 5,
    title: "Client follow-up call",
    project: "Sales",
    dueDate: "2025-11-17T15:00:00.000Z", // Next Week
  },
];
// --- End Mock Data ---

// --- Date Grouping Logic ---

/**
 * Groups tasks by formatted date headings (e.g., "Tomorrow", "Friday, Nov 14")
 */
const groupTasksByDate = (tasks) => {
  const groups = {};
  const today = new Date("2025-11-12T12:00:00.000Z"); // Using a fixed "today" for consistent mock data
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 7);

  // Formatter for dates (e.g., "Friday, Nov 14")
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  for (const task of tasks) {
    const dueDate = new Date(task.dueDate);
    let groupName = "";

    // Check if it's tomorrow
    if (
      dueDate.getDate() === tomorrow.getDate() &&
      dueDate.getMonth() === tomorrow.getMonth() &&
      dueDate.getFullYear() === tomorrow.getFullYear()
    ) {
      groupName = `Tomorrow, ${dateFormatter.format(dueDate).split(", ")[1]}`; // e.g., "Tomorrow, Nov 13"
    }
    // Check if it's within the next week
    else if (dueDate > tomorrow && dueDate < oneWeekFromNow) {
      groupName = dateFormatter.format(dueDate); // e.g., "Friday, Nov 14"
    }
    // Anything further out
    else if (dueDate >= oneWeekFromNow) {
      groupName = "Later";
    }

    if (groupName) {
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(task);
    }
  }

  // Sort the groups by date
  const sortedGroupTuples = Object.entries(groups).sort((a, b) => {
    // A bit of a hack to make "Tomorrow" always first and "Later" always last
    if (a[0].startsWith("Tomorrow")) return -1;
    if (b[0].startsWith("Tomorrow")) return 1;
    if (a[0] === "Later") return 1;
    if (b[0] === "Later") return -1;
    // Otherwise, sort by the actual date of the first task in the group
    return new Date(a[1][0].dueDate) - new Date(b[1][0].dueDate);
  });

  return new Map(sortedGroupTuples); // Use Map to preserve insertion order
};
// --- End Date Grouping Logic ---

const Upcoming = () => {
  const groupedTasks = groupTasksByDate(mockTasks);

  return (
    <Card className="bg-secondary border-0 h-full">
      <CardHeader>
        <CardTitle>Upcoming</CardTitle>
        <CardDescription>What's next on your plate</CardDescription>
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
                No upcoming tasks.
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Upcoming;