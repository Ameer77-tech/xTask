"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Pause,
  Edit,
  Trash2,
  Calendar,
  RotateCcw,
  Check,
  CheckCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const formatTime = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};
const TaskCard = ({
  task,
  setActionClicked,
  setAction,
  setTaskDetails,
  onPlay,
  onPause,
  onReset,
  runningTask,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      onPlay(task._id);
    } else {
      onPause(task._id);
    }
  }, [isPlaying]);

  return (
    <Card
      className={clsx(
        "bg-[#111] border-gray-800 rounded-2xl shadow-md relative transition-all ease duration-300",
        runningTask === ""
          ? ""
          : runningTask === task._id
          ? "scale-105  "
          : "opacity-35"
      )}
    >
      {task.completed && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center
               bg-black/50 backdrop-blur-[1px] text-primary"
        >
          <div
            className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl 
                 shadow-xl border border-white/20 font-semibold text-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Completed
          </div>
        </div>
      )}
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg font-semibold text-white">
            {task.title}
          </CardTitle>
          <p className="text-sm text-gray-400">{task.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (task.completed) {
                return;
              }
              setAction("edit");
              setTaskDetails({ title: task.title, id: task._id });
              setActionClicked(true);
            }}
            size="icon"
            variant={"default"}
            className={"bg-accent hover:bg-accent/80"}
          >
            <Edit className="w-4 h-4 hover:text-blue-600" />
          </Button>
          <Button
            onClick={() => {
              if (task.completed) {
                return;
              }
              setAction("delete");
              setTaskDetails({ title: task.title, id: task._id });
              setActionClicked(true);
            }}
            size="icon"
            variant={"ghost"}
            className={"hover:bg-destructive/30 group"}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{new Date(task.dueDate).toLocaleDateString("en-GB")}</span>
        </div>

        <Badge
          className={
            task.priority === 1
              ? "bg-red-600"
              : task.priority === 2
              ? "bg-yellow-600"
              : "bg-green-600"
          }
        >
          {task.priority === 1
            ? "High"
            : task.priority === 2
            ? "Medium"
            : "Low"}{" "}
          Priority
        </Badge>

        <div className="flex justify-between items-center pt-3 border-t border-gray-800">
          <div className="text-gray-300 font-mono">
            {formatTime(task.timer)}
          </div>
          <div className="flex gap-5">
            <Button
              size="icon"
              variant="ghost"
              className="text-white bg-indigo-600 hover:bg-indigo-700 rounded-full"
              onClick={() => {
                setIsPlaying(!isPlaying);
              }}
            >
              {isPlaying && runningTask === task._id ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
            <Button
              onClick={() => {
                onReset(task._id);
                setIsPlaying(false);
              }}
              size="icon"
              variant="ghost"
              className="text-white bg-indigo-600 hover:bg-indigo-700 rounded-full"
            >
              <RotateCcw />
            </Button>
            <Button
              onClick={() => {
                if (task.completed) {
                  return;
                }
                setAction("mark");
                setTaskDetails({ title: task.title, id: task._id });
                setActionClicked(true);
              }}
              className="bg-primary rounded-full"
            >
              <Check />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
