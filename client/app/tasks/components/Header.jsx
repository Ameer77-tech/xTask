import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ViewToggle from "./ViewToggle";
import { Suspense } from "react";

const Header = ({ view }) => {
  return (
    <Card
      className={
        "bg-transparent md:border-0 border-b-2 border-t-0 border-l-0 rounded-none flex flex-row md:justify-between justify-center items-center"
      }
    >
      <CardHeader
        className={
          "md:w-1/2 w-full md:place-items-start place-items-center gap-0"
        }
      >
        <CardTitle className={"text-4xl"}>My Tasks</CardTitle>
        <CardDescription>
          Manage your tasks efficiently and effectively
        </CardDescription>
      </CardHeader>
      <Suspense><ViewToggle view={view} /></Suspense>

    </Card>
  );
};

export default Header;
