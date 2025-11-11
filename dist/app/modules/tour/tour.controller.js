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
exports.tourControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const tour_service_1 = require("./tour.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createTourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const tourType = yield tour_service_1.tourServices.createTourType(payload);
    (0, sendResponse_1.sendResponse)(res, {
        data: tourType.newTourType,
        message: "create tour type successfully",
        statusCode: http_status_codes_1.default.CREATED,
        success: true
    });
}));
const getTourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_service_1.tourServices.getTourTypes();
    (0, sendResponse_1.sendResponse)(res, {
        data: tourType,
        message: "tour types retrived successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const updateTourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tourTypeId = req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const tourType = yield tour_service_1.tourServices.updateTourType(tourTypeId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        data: tourType.updatedTourType,
        message: "tour type update successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const deleteTourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourTypeId = req.params.id;
    const tourType = yield tour_service_1.tourServices.deleteTourType(tourTypeId);
    (0, sendResponse_1.sendResponse)(res, {
        data: tourType,
        message: "tour type deleted successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const createTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { images: (_a = req.files) === null || _a === void 0 ? void 0 : _a.map(file => file.path) });
    const tour = yield tour_service_1.tourServices.createTour(payload);
    (0, sendResponse_1.sendResponse)(res, {
        data: tour.newTour,
        message: "tour created successfully!",
        statusCode: http_status_codes_1.default.CREATED,
        success: true
    });
}));
const getAllTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const tour = yield tour_service_1.tourServices.getAllTour(query);
    (0, sendResponse_1.sendResponse)(res, {
        data: tour.getTours,
        meta: tour.meta,
        message: "tour retrived successfully!",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const updateTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tourId = req.params.id;
    const payload = Object.assign({}, req.body);
    const uploadedImages = (_a = req.files) === null || _a === void 0 ? void 0 : _a.map(file => file.path);
    if (uploadedImages && uploadedImages.length > 0) {
        payload.images = uploadedImages;
    }
    const tour = yield tour_service_1.tourServices.updateTour(tourId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        data: tour.updatedTour,
        message: "Tour updated successfully!",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const deleteTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourId = req.params.id;
    const tour = yield tour_service_1.tourServices.deleteTour(tourId);
    (0, sendResponse_1.sendResponse)(res, {
        data: tour,
        message: "tour deleted successfully!",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const getSingleTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourId = req.params.id;
    const tour = yield tour_service_1.tourServices.getSingleTour(tourId);
    (0, sendResponse_1.sendResponse)(res, {
        data: tour,
        message: "tour retrived successfully!",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
exports.tourControllers = { createTourType, getTourType, updateTourType, deleteTourType, createTour, getAllTour, updateTour, deleteTour, getSingleTour };
