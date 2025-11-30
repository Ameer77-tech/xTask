import React from "react";
import {
  CardDescription,
  CardHeader,
  CardTitle,
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import clsx from "clsx";
import AddTaskBtn from "./AddTaskBtn";

const Header = ({ title, desc, priority, projectId }) => {
  return (
    <Card
      className={
        "bg-transparent border-r-0 md:border-0 border-b-2 border-t-0 border-l-0 rounded-none flex md:flex-row md:justify-between justify-center items-center"
      }
    >
      <CardHeader
        className={
          "md:w-1/2 w-full lg:place-items-start place-items-center gap-0"
        }
      >
        <CardTitle
          className={
            "text-2xl lg:text-4xl text-center lg:flex lg:flex-row flex flex-col lg:items-end items-center"
          }
        >
          {title}.{" "}
          <p className="text-sm font-normal tracking-tight ml-5">
            Priority :{" "}
            <span
              className={clsx(
                priority === 1
                  ? "text-destructive"
                  : priority === 2
                  ? "text-yellow-600"
                  : "text-primary"
              )}
            >
              {priority === 1 ? "High" : priority === 2 ? "Medium" : "Low"}
            </span>
          </p>
        </CardTitle>
        <CardDescription className={"text-center"}>{desc}.</CardDescription>
      </CardHeader>
      <CardFooter>
        <AddTaskBtn id={projectId} />
      </CardFooter>
    </Card>
  );
};

export default Header;
