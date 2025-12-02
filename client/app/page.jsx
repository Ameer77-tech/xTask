import AppSideBar from "@/components/SideBar";
import React from "react";
import Dashboard from "./components/Dashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserInitaializer from "./initializers/user.initializer";
import Loading from "@/components/Loading";
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
  const getDashboardData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/dashboard`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Cookie: cookieHeader,
          },
          credentials: "include",
        }
      );
      return await response.json();
    } catch (err) {
      console.err(err);
    }
  };

  const userData = await getUserData();
  const DashboardData = await getDashboardData();

  return (
    <div className="h-screen w-screen flex justify-start">
      <UserInitaializer userData={userData} />
      <AppSideBar />
      <Dashboard data={DashboardData} />
    </div>
  );
};

export default page;
