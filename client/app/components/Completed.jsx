import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCheck } from "lucide-react";

const groupByDate = (items) => {
  const groups = {};

  for (const item of items) {
    const date = new Date(item.date);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let groupName = "";

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      groupName = "Today";
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      groupName = "Yesterday";
    } else {
      const formatter = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      groupName = formatter.format(date);
    }

    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(item);
  }

  return new Map(
    Object.entries(groups).sort((a, b) => {
      return new Date(b[1][0].date) - new Date(a[1][0].date);
    })
  );
};

const Completed = ({ data }) => {
  const grouped = groupByDate(data);

  return (
    <Card className="bg-secondary border-0 h-full">
      <CardHeader>
        <CardTitle>Completed</CardTitle>
        <CardDescription>What you've finished</CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="flex flex-col gap-4">
            {grouped.size > 0 ? (
              Array.from(grouped.entries()).map(([dateGroup, tasks]) => (
                <div key={dateGroup}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {dateGroup}
                  </h3>

                  <div className="flex flex-col gap-3">
                    {tasks.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-background rounded-lg opacity-70"
                      >
                        <CheckCheck
                          size={20}
                          className="text-emerald-500 shrink-0"
                        />
                        <div className="flex-1">
                          <p className="font-medium line-through">
                            {item.name}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {item.type}
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
