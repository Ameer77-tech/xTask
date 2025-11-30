import React from "react";
import NewProBtn from "./NewProBtn";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Header = () => {
  return (
    <Card
      className={
        "bg-transparent md:border-0 border-b-2 border-t-0 border-l-0 rounded-none flex md:flex-row md:justify-between justify-center items-center"
      }
    >
      <CardHeader
        className={
          "md:w-1/2 w-full md:place-items-start place-items-center gap-0"
        }
      >
        <CardTitle className={"text-4xl"}>Projects</CardTitle>
        <CardDescription>
          A simplified overview of your projects  
        </CardDescription>
      </CardHeader>
      <NewProBtn />
    </Card>
  );
};

export default Header;
