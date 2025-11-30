import React from "react";
import { BellOff } from "lucide-react";

const NoNotifications = () => {
  return (
    <div className="flex justify-center items-center w-full p-5 lg:p-0">
      <div
        className="
      w-full max-w-sm mx-auto 
      max-h-[70vh]
      p-8 sm:p-12 
      bg-card text-card-foreground 
      rounded-lg border 
      shadow-sm 
      flex flex-col items-center justify-center 
      space-y-4
    "
      >
        <div
          className="
        text-4xl sm:text-5xl 
        text-primary 
        p-3 
        bg-primary/10 
        rounded-full 
        flex items-center justify-center
      "
        >
          <BellOff className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <h3
          className="
        text-xl sm:text-2xl 
        font-semibold 
        text-foreground
      "
        >
          No Notifications Yet
        </h3>
        <p
          className="
        text-center 
        text-sm sm:text-base 
        text-muted-foreground
      "
        >
          All caught up! We'll notify you when new activities or updates occur.
        </p>
      </div>
    </div>
  );
};

export default NoNotifications;
