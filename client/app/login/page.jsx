import React from "react";
import Form from "./components/Form";
import ThemeSetter from "@/components/ThemeSetter";

const Page = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-background p-4">
      <ThemeSetter />
      <Form />
    </div>
  );
};

export default Page;
