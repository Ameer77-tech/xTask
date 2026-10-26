import { z } from "zod";

export const addProjectSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string({ error: "Description must be a string" })
    .max(5000, "Description cannot exceed 5000 characters")
    .optional()
    .default(""),
  dueDate: z
    .string({ error: "Invalid dueDate format, must be a valid date" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid dueDate format, must be a valid date",
    }),
  priority: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => (val === undefined ? 1 : Number(val)))
    .refine((val) => [1, 2, 3].includes(val), {
      message: "Priority must be 1 (low), 2 (medium), or 3 (high)",
    }),
  status: z
    .enum(["not-started", "planning", "in-progress", "completed"], {
      error: "Invalid status value",
    })
    .optional()
    .default("not-started"),
});

export const editProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
  description: z
    .string()
    .max(5000, "Description cannot exceed 5000 characters")
    .optional(),
  dueDate: z
    .string()
    .optional()
    .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
      message: "Invalid dueDate format, must be a valid date",
    }),
  priority: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => (val === undefined ? undefined : Number(val)))
    .refine((val) => val === undefined || [1, 2, 3].includes(val), {
      message: "Priority must be 1 (low), 2 (medium), or 3 (high)",
    }),
  status: z
    .enum(["not-started", "planning", "in-progress", "completed"])
    .optional(),
  completed: z.boolean().optional(),
});
