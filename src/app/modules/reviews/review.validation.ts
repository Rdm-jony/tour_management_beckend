import z from "zod";

export const reviewCreateSchema = z.object({
    tour: z.string(),
    rating: z
        .number({
            required_error: "Rating is required",
            invalid_type_error: "Rating must be a number",
        })
        .int()
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating must be at most 5" }),
    comment: z
        .string({ required_error: "Comment is required" })
        .min(3, { message: "Comment must be at least 3 characters" })
        .max(2000, { message: "Comment is too long" })
        .transform((s) => s.trim()),
});

export const reviewUpdateSchema = z.object({
    tour: z.string().optional(),
    rating: z
        .number({
            required_error: "Rating is required",
            invalid_type_error: "Rating must be a number",
        })
        .int()
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating must be at most 5" }).optional(),
    comment: z
        .string({ required_error: "Comment is required" })
        .min(3, { message: "Comment must be at least 3 characters" })
        .max(2000, { message: "Comment is too long" })
        .transform((s) => s.trim()).optional(),
});