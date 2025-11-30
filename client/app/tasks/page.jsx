import AppSideBar from "@/components/SideBar";
import React, { Suspense } from "react";
import TasksSection from "./components/TasksSection";
import Loading from "@/components/Loading";

const page = async ({ params, searchParams }) => {
  const parametre = await searchParams;
  const filter = parametre.filter || "all";
  const view = parametre.view || "list";

  return (
    <>
      <div className="h-screen w-screen flex justify-start">
        <AppSideBar />
        <Suspense fallback={<Loading />}>
          <TasksSection filter={filter} view={view} />
        </Suspense>
      </div>
    </>
  );
};

export default page;
