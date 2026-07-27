import { z } from "zod";

const ALIAS_PATTERN = /^[a-zA-Z0-9]+$/;

export const createUrlSchema = z.object({
  longUrl: z
    .string()
    .trim()
    .min(1, "Destination URL is required")
    .max(2048, "Destination URL cannot exceed 2,048 characters")
    .pipe(z.url({ error: "Enter a valid URL (e.g. https://example.com/page)" })),

  customAlias: z
    .string()
    .trim()
    .min(3, "Custom code must be at least 3 characters")
    .max(50, "Custom code cannot exceed 50 characters")
    .regex(
      ALIAS_PATTERN,
      "Custom alias can only contain letters and numbers (no spaces or symbols)"
    )
    .optional(),
});

export const deleteUrlParamsSchema = z.object({
  id: z.uuid("Invalid link ID"),
});

export const redirectUrlParamsSchema = z.object({
  shortCode: z
    .string()
    .trim()
    .min(1, "Short code is required")
    .max(50, "Short code cannot exceed 50 characters")
    .regex(
      ALIAS_PATTERN,
      "Short code contains invalid characters"
    ),
});