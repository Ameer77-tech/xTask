"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Pause,
  PenSquare,
  PlayIcon,
  RotateCcw,
  Trash2,
  CheckCheck,
} from "lucide-react";
import clsx from "clsx";
import useTaskStore from "@/app/Store/task.store";
import { animate } from "motion";

const Task = ({
  id,
  status,
  name,
  desc,
  filter,
  due,
  priority,
  setActionClicked,
  setaction,
  settaskData,
  timer,
  formatTime,
  runningTask,
  onPlay,
  onPause,
  onReset,
  index,
}) => {
  const MotionTableRow = motion(TableRow);
  
  return (
    <MotionTableRow
      layout
      transition={{
        duration: 0.3,
        delay: index * 0.01,
        layout: {
          duration: 1,
          delay: index * 0.1,
        },
      }}
      className={clsx(
        "h-20",
        status === "completed" &&
          filter !== "completed" &&
          "opacity-30 trasnsition-all ease duration-300 pointer-events-none",
        runningTask === ""
          ? ""
          : runningTask === id
          ? "opacity-100"
          : "opacity-50"
      )}
    >
      <TableCell>
        <div className="flex flex-col gap-1">
          <p className="font-medium">{name}</p>
          <p className="text-muted-foreground text-sm">{desc}</p>
        </div>
      </TableCell>

      <TableCell>{new Date(due).toLocaleDateString("en-GB")}</TableCell>

      <TableCell>
        <Badge
          className="px-2 py-1 text-center text-xs font-medium w-fit text-black"
          variant={
            status === "completed"
              ? "completed"
              : priority === 1
              ? "destructive"
              : priority === 2
              ? "medium"
              : "default"
          }
        >
          {status === "completed"
            ? "Completed"
            : priority === 1
            ? "High"
            : priority === 2
            ? "Medium"
            : "Low"}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">
            {timer === 0 ? "00:00:00" : formatTime(timer)}
          </span>

          {runningTask === id ? (
            <button
              onClick={() => onPause(id)}
              className={clsx(
                "dark:hover:text-white hover:text-black text-muted-foreground transition-all ease",
                filter === "completed" && "pointer-events-none opacity-30"
              )}
            >
              <Pause size={20} />
            </button>
          ) : (
            <button
              onClick={() => onPlay(id)}
              className={clsx(
                "dark:hover:text-white hover:text-black text-muted-foreground transition-all ease",
                filter === "completed" && "pointer-events-none opacity-30"
              )}
            >
              <PlayIcon size={20} />
            </button>
          )}

          <button
            onClick={() => onReset(id)}
            className={clsx(
              "dark:hover:text-white text-muted-foreground hover:text-black transition-all ease",
              filter === "completed" && "pointer-events-none opacity-30"
            )}
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex gap-5 relative">
          <button
            className={clsx(
              "hover:text-primary transition-all ease",
              filter === "completed" && "pointer-events-none text-primary"
            )}
            onClick={() => {
              setActionClicked(true);
              setaction("mark");
              settaskData({ text: name, id });
            }}
          >
            {filter === "completed" ? (
              <CheckCheck size={20} />
            ) : (
              <Check size={20} />
            )}
          </button>
          <button
            className={clsx(
              "hover:text-chart-1 transition-all ease",
              filter === "completed" &&
                "pointer-events-none text-muted-foreground opacity-25"
            )}
            onClick={() => {
              setActionClicked(true);
              setaction("edit");
              settaskData({ text: name, id });
            }}
          >
            <PenSquare size={20} />
          </button>
          <button
            className="hover:scale-110 transition-all ease"
            onClick={() => {
              setActionClicked(true);
              setaction("delete");
              settaskData({ text: name, id });
            }}
          >
            <Trash2 size={20} color="red" />
          </button>
          {runningTask === id && (
            <p className="text-shadow-accent text-primary absolute right-2 top-0">
              Running
            </p>
          )}
        </div>
      </TableCell>
    </MotionTableRow>
  );
};

export default Task;
