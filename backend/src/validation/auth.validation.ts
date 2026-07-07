import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .trim()
    .max(50, "First name cannot exceed 50 characters")
    .optional(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email is too long" })
    .pipe(z.email({ error: "Invalid email format" })),

  password: z
    .string()
    .min(12, "Password must be at least 12 characters long")
    .max(64, "Password cannot exceed 64 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1).max(255).pipe(z.email()),
  password: z.string().min(1),
});
