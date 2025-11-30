"use client";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const ShowDialog = ({
  Data,
  setActionClicked,
  onDelete,
  action,
  seteditingTask,
  onMark,
  isPending,
  setEditingForm,
}) => {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && setActionClicked(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <motion.div
      onClick={() => setActionClicked(false)}
      className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{
          opacity: 0,
          scale: 0.92,
          y: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.92,
          y: 10,
        }}
        transition={{
          duration: 0.18,
          ease: "easeOut",
        }}
        className="w-full max-w-md"
      >
        <Card className="bg-secondary rounded-xl shadow-xl">
          <CardContent className="py-8 px-6">
            <p className="text-secondary-foreground text-2xl font-medium text-center">
              {action === "delete" ? (
                <>
                  {" "}
                  <span className="text-destructive">Delete</span> task "
                  {Data.title ? Data.title : Data.text}"{" "}
                </>
              ) : action === "edit" ? (
                <>
                  {" "}
                  <span className="text-primary">Edit</span> task "{" "}
                  {Data.title ? Data.title : Data.text}"{" "}
                </>
              ) : (
                <>
                  {" "}
                  <span className="text-cyan-600">Mark</span> "{" "}
                  {Data.title ? Data.title : Data.text}" as completed ?{" "}
                </>
              )}
            </p>
          </CardContent>

          <CardFooter className="px-6 pb-6 flex gap-4 justify-center">
            <Button
              disabled={isPending}
              variant="outline"
              size="lg"
              onClick={() => setActionClicked(false)}
              className="w-1/2 rounded-lg"
            >
              Cancel
            </Button>

            {isPending ? (
              <Button disabled size="sm">
                <Spinner className="size-5" />
                YES
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  action === "delete"
                    ? onDelete(Data.id)
                    : action === "edit"
                    ? (seteditingTask(Data.id), setEditingForm(true))
                    : onMark(Data.id);
                }}
                className="w-1/2 rounded-lg"
              >
                Yes
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ShowDialog;
