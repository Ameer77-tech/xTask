import AppSideBar from "@/components/SideBar";
import React from "react";
import Dashboard from "./components/Dashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserInitaializer from "./initializers/user.initializer";
import Loading from "@/components/Loading";
import ThemeSetter from "@/components/ThemeSetter";
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
    try {
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
        return data.reply;
      } else {
        return data;
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getDashboardData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/dashboard`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            cookie: cookieHeader,
          },
          credentials: "include",
        }
      );
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const userData = await getUserData();
  const DashboardData = await getDashboardData();

  console.log(userData);

  return (
    <div className="h-screen w-screen flex justify-start">
      <ThemeSetter />
      <UserInitaializer userData={userData} />
      <AppSideBar />
      <Dashboard
        data={DashboardData ?? "Cant Fetch"}
        name={userData?.reply?.displayName ?? "Can't Fetch"}
      />
    </div>
  );
};

export default page;
