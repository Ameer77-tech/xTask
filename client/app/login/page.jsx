import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GitBranch, Github } from "lucide-react";
import Link from "next/link";
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
