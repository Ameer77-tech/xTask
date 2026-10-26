import { z } from "zod";

export const feedbackSchema = z.object({
  message: z
    .string({ error: "Feedback message cannot be empty" })
    .trim()
    .min(1, "Feedback message cannot be empty")
    .max(2000, "Feedback cannot exceed 2000 characters"),
});
