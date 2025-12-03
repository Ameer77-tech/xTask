"use client";
import React, { useEffect, useRef, useState } from "react";
import { Grid, List } from "lucide-react";
import { motion } from "motion/react";
import { CardFooter } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

const ViewToggle = ({ view }) => {
  const [left, setleft] = useState(0);
  const [width, setwidth] = useState(0);
  const [viewCardPos, setviewCardPos] = useState(0);
  const viewCardRef = useRef(null);
  const tabRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (viewCardRef.current) {
      const rect = viewCardRef.current.getBoundingClientRect();
      setviewCardPos(rect.left);
    }
    if (tabRef.current) {
      setleft(
        view === "grid"
          ? tabRef.current.getBoundingClientRect().left +
              tabRef.current.getBoundingClientRect().width
          : tabRef.current.getBoundingClientRect().left
      );
      setwidth(tabRef.current.getBoundingClientRect().width);
    }
  }, []);

  const updateParams = (name) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", name);
    router.push(`?${params.toString()}`);
  };
  return (
    <CardFooter className={"p-0 w-50 md:block hidden"}>
      <div
        ref={viewCardRef}
        className="flex relative gap-3 bg-secondary justify-center select-none text-secondary-foreground rounded-2xl w-full px-0 py-3 shadow-sm shadow-muted-foreground/20 overflow-hidden"
      >
        <motion.div
          animate={{
            left: left - viewCardPos,
            width: width,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="dark:bg-accent bg-chart-1 top-1/2 -translate-y-1/2 left-0 rounded-xl absolute h-full z-0"
        ></motion.div>

        <div
          ref={tabRef}
          onClick={(e) => {
            updateParams("list");
            const rect = e.currentTarget.getBoundingClientRect();
            setleft(rect.left);
            setwidth(rect.width);
          }}
          className={`flex items-center justify-center w-1/2 gap-2  rounded cursor-pointer relative z-10 transition-colors ${
            view === "list"
              ? "text-primary-foreground"
              : "text-secondary-foreground"
          }`}
        >
          <List size={20} /> <p className="text-xl">List</p>
        </div>

        <div
          onClick={(e) => {
            updateParams("grid");
            const rect = e.currentTarget.getBoundingClientRect();
            setleft(rect.left);
            setwidth(rect.width);
          }}
          className={`flex items-center justify-center w-1/2 gap-2 cursor-pointer relative z-10 transition-colors ${
            view === "grid"
              ? "text-primary-foreground"
              : "text-secondary-foreground"
          }`}
        >
          <Grid size={20} /> <p className="text-xl">Grid</p>
        </div>
      </div>
    </CardFooter>
  );
};

export default ViewToggle;
