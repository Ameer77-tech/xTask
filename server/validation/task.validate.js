import { z } from "zod";

export const addTaskSchema = z
  .object({
    title: z
      .string({ error: "Title is required" })
      .trim()
      .min(1, "Title is required")
      .max(200, "Title cannot exceed 200 characters"),
    description: z
      .string({ error: "Description must be a string" })
      .optional()
      .default(""),
    type: z.enum(["personal", "project"], {
      error: "Invalid task type. Must be 'personal' or 'project'",
    }),
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
    linkedProject: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "project" &&
      (!data.linkedProject || data.linkedProject.trim() === "")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["linkedProject"],
        message: "Project type requires linkedProject",
      });
    }
  });

export const getTasksSchema = z.object({
  type: z.enum(["personal", "project"], {
    error: "type of task is not valid",
  }),
  filter: z
    .enum(["all", "completed", "in-progress", ""])
    .optional()
    .default("all"),
});

export const editTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").optional(),
    description: z.string().optional(),
    type: z.enum(["personal", "project"]).optional(),
    status: z.enum(["not-started", "pending", "completed"]).optional(),
    priority: z
      .union([z.number(), z.string()])
      .optional()
      .transform((val) => (val === undefined ? undefined : Number(val)))
      .refine((val) => val === undefined || [1, 2, 3].includes(val), {
        message: "Priority must be 1 (low), 2 (medium), or 3 (high)",
      }),
    dueDate: z
      .string()
      .optional()
      .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
        message: "Invalid dueDate format, must be a valid date",
      }),
    timer: z.number().min(0, "Timer must be non-negative").optional(),
    completed: z.boolean().optional(),
  });
