import AppSideBar from "@/components/SideBar";
import React from "react";
import Main from "./components/Main";
import { cookies, cookieStore } from "next/headers";
import { redirect } from "next/navigation";
import TasksInitializer from "@/app/initializers/tasks.initializer";

const page = async ({ params }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const project = await params.id;
  if (!token) {
    redirect("/login");
  }
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  let data;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/projects/get-project/${project}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Cookie: cookieHeader,
        },
        cache: "no-cache",
      }
    );
    data = await response.json();
  } catch (err) {
    console.log(err);
  }
  console.log(data);

  return (
    <>
      <TasksInitializer taskData={data["payload"].tasks} />
      <div className="h-screen w-screen flex justify-start">
        <AppSideBar />
        <Main data={data} projectId={data["payload"].projectId} />
      </div>
    </>
  );
};

export default page;
