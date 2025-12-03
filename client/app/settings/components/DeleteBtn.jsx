"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Dialog from "./Dialog";

const DeleteBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleDelete = async () => {};
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Delete Account"
        description="Are you sure about deleting your account this is not reversible."
        variant="destructive"
        children={
          <Button variant={"destructive"} onClick={() => handleDelete()}>
            Confirm Deletion
          </Button>
        }
      />
      <Button
        onClick={() => setIsOpen(true)}
        variant="destructive"
        className="px-6"
      >
        Delete Account
      </Button>
    </>
  );
};

export default DeleteBtn;
