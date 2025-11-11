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
exports.tourServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const tour_model_1 = require("./tour.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const tour_contsant_1 = require("./tour.contsant");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const cloudinary_confilg_1 = require("../../config/cloudinary.confilg");
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newTourType = yield tour_model_1.TourType.create(payload);
    return {
        newTourType
    };
});
const getTourTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    const tourTypesWithCount = yield tour_model_1.TourType.aggregate([
        {
            $lookup: {
                from: "tours", // ✅ collection name (check your model name carefully)
                localField: "_id",
                foreignField: "tourType",
                as: "tours"
            }
        },
        {
            $addFields: {
                totalTours: { $size: "$tours" }
            }
        },
        {
            $project: {
                tours: 0 // tours array hide করে শুধুমাত্র count return করা
            }
        }
    ]);
    return tourTypesWithCount;
});
const updateTourType = (tourTypeId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findTourType = yield tour_model_1.TourType.findById(tourTypeId);
    if (!findTourType) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour type not found");
    }
    const updatedTourType = yield tour_model_1.TourType.findByIdAndUpdate(tourTypeId, payload, { new: true, runValidators: true });
    if (findTourType.image && payload.image) {
        yield (0, cloudinary_confilg_1.deleteImageFromCLoudinary)(findTourType.image);
    }
    return {
        updatedTourType
    };
});
const deleteTourType = (tourTypeId) => __awaiter(void 0, void 0, void 0, function* () {
    const findTourType = yield tour_model_1.TourType.findById(tourTypeId);
    if (!findTourType) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour type not found");
    }
    const isExistInTour = yield tour_model_1.Tour.findOne({ tourType: tourTypeId });
    if (isExistInTour) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Tour type exists in tours. Cannot delete.");
    }
    yield tour_model_1.TourType.findByIdAndDelete(tourTypeId);
    if (findTourType.image) {
        yield (0, cloudinary_confilg_1.deleteImageFromCLoudinary)(findTourType.image);
    }
});
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newTour = yield tour_model_1.Tour.create(payload);
    return { newTour };
});
const getAllTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const getTours = yield queryBuilder
        .filter()
        .search(tour_contsant_1.tourSearChQueryFields)
        .sort()
        .fields()
        .paginate()
        .build().populate("division").populate("tourType");
    const meta = yield queryBuilder.getMeta();
    return {
        getTours,
        meta
    };
});
const getSingleTour = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    const findTour = yield tour_model_1.Tour.findById(tourId).populate("tourType").populate("division");
    if (!findTour) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour not found");
    }
    return findTour;
});
const updateTour = (tourId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findTour = yield tour_model_1.Tour.findById(tourId);
    if (!findTour) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour not found");
    }
    if (payload.images && payload.images.length > 0) {
        payload.images = [...(findTour.images || []), ...payload.images];
    }
    else if (!payload.images) {
        payload.images = findTour.images;
    }
    if (payload.deletedImages && payload.deletedImages.length > 0) {
        const remainingImages = (payload.images || []).filter(img => { var _a; return !((_a = payload.deletedImages) === null || _a === void 0 ? void 0 : _a.includes(img)); });
        payload.images = remainingImages;
        yield Promise.all(payload.deletedImages.map(cloudinary_confilg_1.deleteImageFromCLoudinary));
    }
    if (payload.videoUrl === "") {
        delete payload.videoUrl;
    }
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(tourId, payload, {
        new: true,
        runValidators: true,
    });
    return { updatedTour };
});
const deleteTour = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    const findTour = yield tour_model_1.Tour.findById(tourId);
    if (!findTour) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour is not found");
    }
    yield tour_model_1.Tour.findByIdAndDelete(tourId);
    if ((findTour === null || findTour === void 0 ? void 0 : findTour.images) && (findTour === null || findTour === void 0 ? void 0 : findTour.images.length) > 0) {
        yield Promise.all(findTour.images.map(image => (0, cloudinary_confilg_1.deleteImageFromCLoudinary)(image)));
    }
});
exports.tourServices = { createTourType, getTourTypes, updateTourType, deleteTourType, createTour, getAllTour, updateTour, deleteTour, getSingleTour };
