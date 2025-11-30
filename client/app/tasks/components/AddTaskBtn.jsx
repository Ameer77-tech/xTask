"use client";
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddTaskForm from "./AddTaskForm";
const AddTaskBtn = () => {
  const [showForm, setShowForm] = useState(false);
  const isMobile = useIsMobile();
  return (
    <>
      <AddTaskForm isOpen={showForm} setIsOpen={setShowForm}></AddTaskForm>
      {isMobile ? (
        <Button
          onClick={() => setShowForm(true)}
          size={"lg"}
          aria-label="Add task"
          className={
            "fixed bottom-5 right-5 z-50 rounded-full w-14 h-14 p-0 flex items-center justify-center"
          }
        >
          <Plus size={24} />
        </Button>
      ) : (
        <Button onClick={() => setShowForm((prev) => !prev)} size={"lg"}>
          <Plus />
          Add Task
        </Button>
      )}
    </>
  );
};

export default AddTaskBtn;
