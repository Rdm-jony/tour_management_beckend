import mongoose from "mongoose";
import z from "zod";

export const createTourTypeZodSchema = z.object({
    name: z.string({ invalid_type_error: "name must be string" }).nonempty("name is required")
})
export const updateTourTypeZodSchema = z.object({
    name: z.string({ invalid_type_error: "name must be string" }).optional()
})

export const createTourZodSchema = z.object({
    title: z
        .string({ invalid_type_error: "Title must be a string" })
        .min(3, "Title must be at least 3 characters long"),
    description: z
        .string({ invalid_type_error: "Description must be a string" })
        .min(10, "Description must be at least 10 characters")
        .optional(),
    images: z
        .array(z.string().url("Each image must be a valid URL"))
        .optional(),

    included: z
        .array(z.string())
        .optional(),

    excluded: z
        .array(z.string())
        .optional(),

    costForm: z
        .number({ invalid_type_error: "Cost must be a number" })
        .positive("Cost must be greater than 0").optional(),

    location: z
        .string({ invalid_type_error: "Location must be a string" })
        .min(3, "Location must be at least 3 characters").optional(),
    lat: z.string().optional(),
    lng: z.string().optional(),
    maxGuest: z
        .number({ invalid_type_error: "Max guest must be a number" })
        .int()
        .positive().optional(),
    videoUrl: z.string().optional(),

    minAge: z
        .number({ invalid_type_error: "Min age must be a number" })
        .int()
        .positive().optional(),

    division: z
        .string({ invalid_type_error: "Division ID must be a string" })
        .refine(val => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid division ID",
        }),

    tourType: z
        .string({ invalid_type_error: "TourType ID must be a string" })
        .refine(val => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid tourType ID",
        }),
});

export const updateTourZodSchema = z.object({
    title: z
        .string({ invalid_type_error: "Title must be a string" })
        .min(3, "Title must be at least 3 characters long").optional(),
    description: z
        .string({ invalid_type_error: "Description must be a string" })
        .min(10, "Description must be at least 10 characters")
        .optional(),
    images: z
        .array(z.string().url("Each image must be a valid URL"))
        .optional(),
    videoUrl: z.string().optional(),

    deletedImages: z
        .array(z.string().url("Each image must be a valid URL"))
        .optional(),

    included: z
        .array(z.string())
        .optional(),

    excluded: z
        .array(z.string())
        .optional(),


    costForm: z
        .number({ invalid_type_error: "Cost must be a number" }).optional(),

    location: z
        .string({ invalid_type_error: "Location must be a string" })
        .min(3, "Location must be at least 3 characters").optional(),
    lat: z.string().optional(),
    lng: z.string().optional(),
    maxGuest: z
        .number({ invalid_type_error: "Max guest must be a number" })
        .int()
        .positive().optional(),

    minAge: z
        .number({ invalid_type_error: "Min age must be a number" })
        .int()
        .positive().optional(),

    division: z
        .string({ invalid_type_error: "Division ID must be a string" })
        .refine(val => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid division ID",
        }).optional(),

    tourType: z
        .string({ invalid_type_error: "TourType ID must be a string" })
        .refine(val => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid tourType ID",
        }).optional(),
});