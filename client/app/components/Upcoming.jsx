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

const groupTasksByDate = (tasks) => {
  const groups = {};
  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 7);

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  for (const task of tasks) {
    const dueDate = new Date(task.date);
    let groupName = "";

    if (
      dueDate.getDate() === tomorrow.getDate() &&
      dueDate.getMonth() === tomorrow.getMonth() &&
      dueDate.getFullYear() === tomorrow.getFullYear()
    ) {
      groupName = `Tomorrow, ${formatter.format(dueDate).split(", ")[1]}`;
    } else if (dueDate > tomorrow && dueDate < oneWeekFromNow) {
      groupName = formatter.format(dueDate);
    } else if (dueDate >= oneWeekFromNow) {
      groupName = "Later";
    }

    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(task);
  }

  const sorted = Object.entries(groups).sort((a, b) => {
    if (a[0].startsWith("Tomorrow")) return -1;
    if (b[0].startsWith("Tomorrow")) return 1;
    if (a[0] === "Later") return 1;
    if (b[0] === "Later") return -1;
    return new Date(a[1][0].date) - new Date(b[1][0].date);
  });

  return new Map(sorted);
};

const Upcoming = ({ data }) => {
  const groupedTasks = groupTasksByDate(data);

  return (
    <Card className="bg-secondary border-0 h-full">
      <CardHeader>
        <CardTitle>Upcoming</CardTitle>
        <CardDescription>What's next on your plate</CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
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
                        {/* <Checkbox id={`task-${task.id}`} /> */}

                        <div className="flex-1">
                          <label
                            htmlFor={`task-${task.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {task.name}
                          </label>

                          <Badge variant="outline" className="mt-1">
                            {task.type}
                          </Badge>
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
