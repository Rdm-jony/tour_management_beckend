"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.divisionServices = void 0;
const cloudinary_confilg_1 = require("../../config/cloudinary.confilg");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const tour_model_1 = require("../tour/tour.model");
const division_model_1 = require("./division.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newDivision = yield division_model_1.Division.create(payload);
    return {
        newDivision
    };
});
const getDivision = () => __awaiter(void 0, void 0, void 0, function* () {
    const divisions = yield division_model_1.Division.aggregate([
        {
            $lookup: {
                from: "tours", // collection name (must match the actual collection)
                localField: "_id",
                foreignField: "division",
                as: "tours"
            }
        },
        {
            $addFields: {
                totalTours: { $size: "$tours" } // count how many tours in that division
            }
        },
        {
            $project: {
                tours: 0 // hide the tours array if you only want the count
            }
        }
    ]);
    return divisions;
});
const updateDivision = (divisionId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findDivision = yield division_model_1.Division.findById(divisionId);
    if (!findDivision) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "divison not found.Use valid objectId");
    }
    const duplicateDivision = yield division_model_1.Division.findOne({
        name: { $regex: `^${payload.name}$`, $options: "i" },
        _id: { $ne: divisionId },
    });
    if (duplicateDivision) {
        throw new Error("A division with this name already exists.");
    }
    const updatedDivision = yield division_model_1.Division.findByIdAndUpdate(divisionId, payload, { new: true, runValidators: true });
    if (findDivision.thumbnail) {
        yield (0, cloudinary_confilg_1.deleteImageFromCLoudinary)(findDivision.thumbnail);
    }
    return {
        updatedDivision
    };
});
const deleteDivision = (divisionId) => __awaiter(void 0, void 0, void 0, function* () {
    const findDivision = yield division_model_1.Division.findById(divisionId);
    if (!findDivision) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "divison not found.Use valid objectId");
    }
    const isExistInTour = yield tour_model_1.Tour.findOne({ division: divisionId });
    if (isExistInTour) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "This division exists in tours. Cannot delete.");
    }
    yield division_model_1.Division.findByIdAndDelete(divisionId);
    if (findDivision.thumbnail) {
        yield (0, cloudinary_confilg_1.deleteImageFromCLoudinary)(findDivision.thumbnail);
    }
});
exports.divisionServices = { createDivision, getDivision, updateDivision, deleteDivision };
