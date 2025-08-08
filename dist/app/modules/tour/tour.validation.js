"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourZodSchema = exports.createTourZodSchema = exports.updateTourTypeZodSchema = exports.createTourTypeZodSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = __importDefault(require("zod"));
exports.createTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default.string({ invalid_type_error: "name must be string" }).nonempty("name is required")
});
exports.updateTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default.string({ invalid_type_error: "name must be string" }).optional()
});
exports.createTourZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ invalid_type_error: "Title must be a string" })
        .min(3, "Title must be at least 3 characters long"),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .min(10, "Description must be at least 10 characters")
        .optional(),
    images: zod_1.default
        .array(zod_1.default.string().url("Each image must be a valid URL"))
        .optional(),
    amenities: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    included: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    excluded: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    tourPlan: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    costForm: zod_1.default
        .number({ invalid_type_error: "Cost must be a number" })
        .positive("Cost must be greater than 0").optional(),
    startDate: zod_1.default
        .string({ invalid_type_error: "Start date must be a string" })
        .refine(val => !isNaN(Date.parse(val)), {
        message: "Start date must be a valid ISO date string",
    }).optional(),
    endDate: zod_1.default
        .string({ invalid_type_error: "End date must be a string" })
        .refine(val => !isNaN(Date.parse(val)), {
        message: "End date must be a valid ISO date string",
    }).optional(),
    location: zod_1.default
        .string({ invalid_type_error: "Location must be a string" })
        .min(3, "Location must be at least 3 characters").optional(),
    maxGuest: zod_1.default
        .number({ invalid_type_error: "Max guest must be a number" })
        .int()
        .positive().optional(),
    minAge: zod_1.default
        .number({ invalid_type_error: "Min age must be a number" })
        .int()
        .positive().optional(),
    division: zod_1.default
        .string({ invalid_type_error: "Division ID must be a string" })
        .refine(val => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid division ID",
    }),
    tourType: zod_1.default
        .string({ invalid_type_error: "TourType ID must be a string" })
        .refine(val => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid tourType ID",
    }),
});
exports.updateTourZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ invalid_type_error: "Title must be a string" })
        .min(3, "Title must be at least 3 characters long").optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .min(10, "Description must be at least 10 characters")
        .optional(),
    images: zod_1.default
        .array(zod_1.default.string().url("Each image must be a valid URL"))
        .optional(),
    deletedImages: zod_1.default
        .array(zod_1.default.string().url("Each image must be a valid URL"))
        .optional(),
    amenities: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    included: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    excluded: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    tourPlan: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    costForm: zod_1.default
        .number({ invalid_type_error: "Cost must be a number" })
        .positive("Cost must be greater than 0").optional(),
    startDate: zod_1.default
        .string({ invalid_type_error: "Start date must be a string" })
        .refine(val => !isNaN(Date.parse(val)), {
        message: "Start date must be a valid ISO date string",
    }).optional(),
    endDate: zod_1.default
        .string({ invalid_type_error: "End date must be a string" })
        .refine(val => !isNaN(Date.parse(val)), {
        message: "End date must be a valid ISO date string",
    }).optional(),
    location: zod_1.default
        .string({ invalid_type_error: "Location must be a string" })
        .min(3, "Location must be at least 3 characters").optional(),
    maxGuest: zod_1.default
        .number({ invalid_type_error: "Max guest must be a number" })
        .int()
        .positive().optional(),
    minAge: zod_1.default
        .number({ invalid_type_error: "Min age must be a number" })
        .int()
        .positive().optional(),
    division: zod_1.default
        .string({ invalid_type_error: "Division ID must be a string" })
        .refine(val => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid division ID",
    }).optional(),
    tourType: zod_1.default
        .string({ invalid_type_error: "TourType ID must be a string" })
        .refine(val => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid tourType ID",
    }).optional(),
});
