"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewUpdateSchema = exports.reviewCreateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.reviewCreateSchema = zod_1.default.object({
    tour: zod_1.default.string(),
    rating: zod_1.default
        .number({
        required_error: "Rating is required",
        invalid_type_error: "Rating must be a number",
    })
        .int()
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating must be at most 5" }),
    comment: zod_1.default
        .string({ required_error: "Comment is required" })
        .min(3, { message: "Comment must be at least 3 characters" })
        .max(2000, { message: "Comment is too long" })
        .transform((s) => s.trim()),
});
exports.reviewUpdateSchema = zod_1.default.object({
    tour: zod_1.default.string().optional(),
    rating: zod_1.default
        .number({
        required_error: "Rating is required",
        invalid_type_error: "Rating must be a number",
    })
        .int()
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating must be at most 5" }).optional(),
    comment: zod_1.default
        .string({ required_error: "Comment is required" })
        .min(3, { message: "Comment must be at least 3 characters" })
        .max(2000, { message: "Comment is too long" })
        .transform((s) => s.trim()).optional(),
});
