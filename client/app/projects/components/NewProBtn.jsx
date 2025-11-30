"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import MobileBtn from "./MobileBtn";
import AddProjectForm from "./AddProjectForm";

const NewProBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <AddProjectForm isOpen={isOpen} setIsOpen={setIsOpen} />
      <Button
        onClick={() => setIsOpen(true)}
        className={"hidden md:flex"}
        variant={"default"}
        size={"lg"}
      >
        <Plus />
        New Project
      </Button>
      <MobileBtn setIsOpen={setIsOpen}/>
    </>
  );
};

export default NewProBtn;
