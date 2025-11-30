"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import Form from "./Form";
import { AnimatePresence } from "motion/react";

const AddTaskBtn = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <AnimatePresence>
        {isOpen && <Form setIsOpen={setIsOpen} id={id} />}
      </AnimatePresence>
      <Button
        onClick={() => setIsOpen(true)}
        className="ml-auto bg-green-500 hover:bg-green-600"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Task
      </Button>
    </>
  );
};

export default AddTaskBtn;
