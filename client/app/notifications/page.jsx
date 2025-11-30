import React from "react";
import NoNotifications from "./components/NoNotifications";
import AppSideBar from "@/components/SideBar";

const page = () => {
  return (
    <div className="h-screen w-screen flex justify-start">
      <AppSideBar />
      <NoNotifications />
    </div>
  );
};

export default page;
