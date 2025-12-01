import AppSideBar from "@/components/SideBar";
import React, { Suspense } from "react";
import TasksSection from "./components/TasksSection";
import Loading from "@/components/Loading";
import { cookies } from "next/headers";
import UserInitializer from "../initializers/user.initializer";

const page = async ({ params, searchParams }) => {
  const parametre = await searchParams;
  const filter = parametre.filter || "all";
  const view = parametre.view || "list";
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const getUserData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/get-user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },

        cache: "no-store",
      }
    );

    let data = await res.json();

    if (data.reply === "Unauthorized") {
      redirect("/login");
    } else if (!data.success) {
      alert(data.reply);
      return;
    } else {
      return data;
    }
  };

  const data = await getUserData();
  return (
    <>
      <div className="h-screen w-screen flex justify-start">
        <UserInitializer userData={data} />
        <AppSideBar />
        <Suspense fallback={<Loading />}>
          <TasksSection filter={filter} view={view} />
        </Suspense>
      </div>
    </>
  );
};

export default page;
