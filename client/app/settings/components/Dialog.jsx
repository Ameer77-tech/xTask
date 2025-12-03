"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog as ShadDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const variantStyles = {
  primary: "border-blue-500",
  secondary: "border-gray-500",
  success: "border-green-500",
  warning: "border-yellow-500",
  destructive: "border-red-500",
};

const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  variant = "primary",
  children,
  footer,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <ShadDialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            className={`p-6 rounded-2xl border-2 ${variantStyles[variant]}`}
          >
            {/* Animation wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold capitalize">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-sm opacity-80">
                  {description}
                </DialogDescription>
              </DialogHeader>

              <div className="my-4">{children}</div>

              {footer && <DialogFooter>{footer}</DialogFooter>}
            </motion.div>
          </DialogContent>
        </ShadDialog>
      )}
    </AnimatePresence>
  );
};

export default Dialog;
