import AppSideBar from "@/components/SideBar";
import React, { Suspense } from "react";
import Main from "./components/Main";
import Loading from "@/components/Loading";
import ProjectInitializer from "../initializers/project.initializer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const page = async ({ params, searchParams }) => {
  const urlData = await searchParams;
  const filter = urlData.filter || "all";
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/projects/get-projects/${filter}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    }
  );
  const data = await res.json();
  const projects = data.success ? data.payload : [];
  return (
    <>
      <ProjectInitializer data={projects} />
      <div className="h-screen w-screen flex justify-start">
        <AppSideBar />
        <Suspense fallback={<Loading />}>
          <Main filter={filter} />
        </Suspense>
      </div>
    </>
  );
};

export default page;
