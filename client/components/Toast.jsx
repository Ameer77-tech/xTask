"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import clsx from "clsx";

const Toast = ({ show, toastData }) => {
  const { message, isSuccess, type } = toastData || {};

  const icons = {
    success: <CheckCircle2 className="text-background" size={26} />,
    error: <XCircle className="text-background" size={26} />,
    info: <Info className="text-background" size={26} />,
  };

  const variant =
    type === "success"
      ? "bg-primary text-background"
      : type === "error"
      ? "bg-red-600/90 text-background"
      : "bg-blue-600/90 text-background";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={clsx(
            "fixed top-6 left-1/2 -translate-x-1/2 z-9999 flex items-center gap-3 px-5 lg:py-3 py-1 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10",
            variant
          )}
        >
          {icons[type] || icons.info}
          <p className="text-sm md:text-base font-medium tracking-tight">
            {message || "Something happened!"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
