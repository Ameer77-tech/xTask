import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CalendarDays,
  CheckCheck,
  CheckCircle,
  ChevronRight,
  MoreVertical,
  PenBox,
  Trash2,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "motion/react";
const MotionCard = motion.create(Card);
const ProjectCard = ({
  project,
  hoveredProject,
  setHoveredProject,
  setData,
  setActionClicked,
  setaction,
  index,
}) => {
  const isMobile = useIsMobile();

  const progress =
    project.totalTasks > 0
      ? Math.round((project.totaltasksCompleted / project.totalTasks) * 100)
      : 0;

  const statusColor = clsx(
    project.status.toLowerCase() === "in-progress" && "text-amber-500",
    project.status.toLowerCase() === "started" && "text-cyan-600",
    project.status.toLowerCase() === "not started" && "text-gray-500",
    project.status.toLowerCase() === "planning" && "text-fuchsia-600",
    project.status.toLowerCase() === "completed" && "text-emerald-600"
  );
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <MotionCard
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: index * 0.3 }}
      onMouseEnter={() => setHoveredProject(project._id)}
      className={clsx(
        "group relative border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out rounded-2xl hover:scale-[1.02] active:scale-[0.98]",
        project.completed && "pointer-events-none"
      )}
    >
      {project.completed && (
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

      {(isMobile || hoveredProject == project._id) && (
        <div className="absolute top-3 right-3 w-5 h-5">
          <DropdownMenu>
            <DropdownMenuTrigger>
              {" "}
              <MoreVertical size={20} className="text-muted-foreground" />{" "}
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"w-70"}>
              <DropdownMenuItem
                onClick={() => {
                  setData({
                    text: project.title,
                    id: project._id,
                  });
                  setaction("mark");
                  setActionClicked(true);
                }}
                className={"hover:bg-primary/30! hover:text-primary!"}
              >
                <CheckCircle /> Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setData({
                    text: project.title,
                    id: project._id,
                  });
                  setaction("edit");
                  setActionClicked(true);
                }}
                className={"dark:hover:bg-accent/30! dark:hover:text-white!"}
              >
                <PenBox /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setData({
                    text: project.title,
                    id: project._id,
                  });
                  setaction("delete");
                  setActionClicked(true);
                }}
                variant="destructive"
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <Link href={`/projects/${project._id}`} className="w-full">
        <CardHeader className="flex py-0 flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div className="flex flex-col">
            <CardTitle className="text-base md:text-lg font-semibold text-foreground">
              {project.title}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground line-clamp-2 hidden md:block">
              {project.description}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <CardDescription
              className={clsx("text-xs font-medium", statusColor)}
            >
              {project.status}
            </CardDescription>
            <ChevronRight className="md:hidden block text-muted-foreground group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle className="text-green-500" size={16} />
            <span>
              {project.totaltasksCompleted}/
              {isNaN(project.totalTasks)
                ? "processing...."
                : project.totalTasks}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays size={14} className="text-red-500" />
            <span>due {formatDate(project.dueDate)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 mt-3">
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="relative w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="absolute left-0 w-full top-0 h-full bg-primary transition-transform duration-500 origin-left"
              style={{ transform: `scaleX(${progress / 100})` }}
            ></div>
          </div>
        </CardFooter>
      </Link>
    </MotionCard>
  );
};

export default ProjectCard;
