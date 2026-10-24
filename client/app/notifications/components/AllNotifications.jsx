import React from "react";
import Link from "next/link";
import {
  Bell,
  AlertCircle,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const getNotificationStyle = (type) => {
  switch (type) {
    case "overdue":
      return {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        badgeBg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        borderLeft: "border-l-red-500",
      };
    case "due-today":
      return {
        icon: <Clock className="w-5 h-5 text-amber-500" />,
        badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        borderLeft: "border-l-amber-500",
      };
    case "upcoming":
      return {
        icon: <Calendar className="w-5 h-5 text-blue-500" />,
        badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        borderLeft: "border-l-blue-500",
      };
    case "milestone":
      return {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        borderLeft: "border-l-emerald-500",
      };
    default:
      return {
        icon: <Bell className="w-5 h-5 text-primary" />,
        badgeBg: "bg-primary/10 text-primary border-primary/20",
        borderLeft: "border-l-primary",
      };
  }
};

const getPriorityBadge = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    case "Medium":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    default:
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  }
};

const AllNotifications = ({ notifications = [] }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              Smart alerts for upcoming deadlines, overdue tasks, and achievements.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
          {notifications.length} active
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => {
          const style = getNotificationStyle(notif.type);
          return (
            <div
              key={notif.id}
              className={`
                group relative bg-card text-card-foreground rounded-xl border p-4 sm:p-5
                shadow-sm hover:shadow-md transition-all duration-200
                border-l-4 ${style.borderLeft} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
              `}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-muted/60 mt-0.5 sm:mt-0 flex-shrink-0">
                  {style.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm sm:text-base text-foreground">
                      {notif.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium border capitalize ${style.badgeBg}`}
                    >
                      {notif.type.replace("-", " ")}
                    </span>
                    {notif.priority && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium border ${getPriorityBadge(
                          notif.priority
                        )}`}
                      >
                        {notif.priority}
                      </span>
                    )}
                    {notif.category && (
                      <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-muted text-muted-foreground border">
                        {notif.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notif.message}
                  </p>
                </div>
              </div>

              {notif.link && (
                <Link
                  href={notif.link}
                  className="
                    inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium
                    text-primary hover:text-primary/80 transition-colors
                    self-end sm:self-center flex-shrink-0 group-hover:translate-x-0.5 transition-transform
                  "
                >
                  View
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllNotifications;
