import React from "react";
import NoNotifications from "./components/NoNotifications";
import AppSideBar from "@/components/SideBar";
import { cookies } from "next/headers";
import UserInitializer from "../initializers/user.initializer";
import ThemeSetter from "@/components/ThemeSetter";
import { redirect } from "next/navigation";

const page = async () => {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

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
          cookie: cookieHeader,
        },
        credentials: "include",
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
  const userData = await getUserData();
  return (
    <div className="h-screen w-screen flex justify-start">
      <ThemeSetter />
      <UserInitializer userData={userData}></UserInitializer>
      <AppSideBar />
      <NoNotifications />
    </div>
  );
};

export default page;
