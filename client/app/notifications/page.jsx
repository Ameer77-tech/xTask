import React from "react";
import NoNotifications from "./components/NoNotifications";
import AllNotifications from "./components/AllNotifications";
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

  const [userRes, notifRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/get-user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    }).catch(() => null),
    fetch(`${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/get-notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    }).catch(() => null),
  ]);

  if (!userRes) {
    redirect("/login");
  }

  const userData = await userRes.json();
  if (userData?.reply === "Unauthorized" || !userData?.success) {
    redirect("/login");
  }

  let notifications = [];
  if (notifRes) {
    try {
      const notifData = await notifRes.json();
      if (notifData?.success && Array.isArray(notifData.notifications)) {
        notifications = notifData.notifications;
      }
    } catch {
      notifications = [];
    }
  }

  return (
    <>
      <ThemeSetter />
      <UserInitializer userData={userData} />
      <div className="h-screen w-screen flex justify-start">
        <AppSideBar />
        <main className="flex-1 h-screen overflow-y-auto">
          {notifications.length > 0 ? (
            <AllNotifications notifications={notifications} />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <NoNotifications />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default page;
