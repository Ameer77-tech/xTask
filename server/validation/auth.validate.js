import { z } from "zod";

export const validateRegister = z.object({
  userName: z
    .string({ error: "All Fields Must be Filled" })
    .trim()
    .min(1, "All Fields Must be Filled"),
  displayName: z
    .string({ error: "All Fields Must be Filled" })
    .trim()
    .min(1, "All Fields Must be Filled"),
  password: z
    .string({ error: "All Fields Must be Filled" })
    .min(1, "All Fields Must be Filled"),
  email: z
    .string({ error: "Invalid email format" })
    .trim()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
});

export const validateLogin = z.object({
  userName: z
    .string({ error: "All Fields Must be Filled" })
    .trim()
    .min(1, "All Fields Must be Filled"),
  password: z
    .string({ error: "All Fields Must be Filled" })
    .min(1, "All Fields Must be Filled"),
});
