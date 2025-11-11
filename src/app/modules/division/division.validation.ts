import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, "Name must be at least 2 characters long"),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .min(10, "Description must be at least 10 characters long")
    .optional(),
});
export const updateDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, "Name must be at least 2 characters long").optional(),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .min(10, "Description must be at least 10 characters long")
    .optional(),

  thumbnail: z
    .string({ invalid_type_error: "Thumbnail must be a string" })
    .url("Thumbnail must be a valid URL")
    .optional(),
});
