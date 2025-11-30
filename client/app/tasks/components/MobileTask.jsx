"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Check,
  Pause,
  PenIcon,
  LucidePlay,
  RotateCcw,
  Trash2,
  LucidePause,
} from "lucide-react";
import clsx from "clsx";

const MobileTask = ({
  id,
  name,
  desc,
  due,
  timer,
  status,
  priority,
  onPlay,
  onPause,
  onReset,
  setActionClicked,
  setaction,
  settaskData,
  formatTime,
  runningTask,
}) => {
  const isCompleted = status.toLowerCase() === "completed" || false;

  return (
    <Card
      className={clsx(
        "border border-gray-700/40 p-4 rounded-xl shadow-sm backdrop-blur-sm transition-all",
        isCompleted ? "opacity-60 pointer-events-none" : "opacity-100",
        runningTask === ""
          ? ""
          : runningTask === id
          ? "scale-105 duration-300 transition-all ease"
          : "opacity-50"
      )}
    >
      <CardHeader className="p-0 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-base font-semibold">{name}</CardTitle>
          <CardDescription className="text-xs leading-tight">
            {desc}
          </CardDescription>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setActionClicked(true);
              setaction("edit");
              settaskData({ text: name, id });
            }}
            className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center hover:bg-accent/40 transition"
          >
            <PenIcon size={14} className="text-blue-400" />
          </button>
          <button
            onClick={() => {
              setActionClicked(true);
              setaction("mark");
              settaskData({ text: name, id });
            }}
            className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center hover:bg-accent/40 transition"
          >
            <Check size={14} className="text-green-400" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-3 flex justify-between items-center border-b pb-3">
        <div className="flex gap-2 text-muted-foreground items-center text-xs">
          <Calendar size={12} />
          {new Date(due).toLocaleDateString("en-GB")}
        </div>
        <div
          className={clsx(
            "text-xs px-2 py-1 rounded-md font-medium capitalize",
            isCompleted
              ? "bg-emerald-500/20 text-emerald-500"
              : priority === "High"
              ? "bg-red-500/20 text-red-500"
              : priority === "Medium"
              ? "bg-yellow-500/20 text-yellow-500"
              : "bg-blue-500/20 text-blue-500"
          )}
        >
          {isCompleted
            ? "Completed"
            : `${
                priority === 1 ? "High" : priority === 2 ? "Medium" : "Low"
              } priority`}
        </div>
      </CardContent>
      <CardFooter className="p-0 mt-4 flex justify-between items-center">
        <div className="text-lg font-bold tracking-tight">
          {timer === 0 ? "00:00:00" : formatTime(timer)}
        </div>

        <div className="flex gap-3 items-center">
          {runningTask === id ? (
            <button className="w-11 h-11 rounded-full bg-accent flex items-center justify-center hover:bg-accent/90 shadow-sm transition">
              <LucidePause
                onClick={() => onPause(id)}
                size={18}
                fill="accent"
                color="accent"
                className=""
              />{" "}
            </button>
          ) : (
            <button className="w-11 h-11 rounded-full bg-accent flex items-center justify-center hover:bg-accent/90 shadow-sm transition">
              <LucidePlay
                onClick={() => onPlay(id)}
                size={18}
                fill="accent"
                color="accent"
                className=""
              />
            </button>
          )}

          <button
            onClick={() => onReset(id)}
            className="w-11 h-11 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition"
          >
            <RotateCcw size={16} className="text-blue-500" />
          </button>
          <button
            onClick={() => {
              setActionClicked(true);
              setaction("delete");
              settaskData({ text: name, id });
            }}
            className="w-11 h-11 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/40 transition"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MobileTask;
