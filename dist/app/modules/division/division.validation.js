"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodSchema = exports.createDivisionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be a string" })
        .min(2, "Name must be at least 2 characters long"),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .min(10, "Description must be at least 10 characters long")
        .optional(),
    thumbnail: zod_1.default
        .string({ invalid_type_error: "Thumbnail must be a string" })
        .url("Thumbnail must be a valid URL")
        .optional(),
});
exports.updateDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be a string" })
        .min(2, "Name must be at least 2 characters long").optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .min(10, "Description must be at least 10 characters long")
        .optional(),
    thumbnail: zod_1.default
        .string({ invalid_type_error: "Thumbnail must be a string" })
        .url("Thumbnail must be a valid URL")
        .optional(),
});
