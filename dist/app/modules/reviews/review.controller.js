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
exports.reviewController = void 0;
const review_service_1 = require("./review.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const addReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.reviewService.addReview(Object.assign(Object.assign({}, req.body), { user: req.user.userId }));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Review added successfully",
        statusCode: http_status_codes_1.default.CREATED,
        data,
    });
}));
const updateReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.reviewService.updateReview(Object.assign(Object.assign({}, req.body), { _id: req.params.reviewId, user: req.user.userId }));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Review updated successfully",
        statusCode: http_status_codes_1.default.OK,
        data,
    });
}));
const getReviewsByTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.reviewService.getReviewsByTour(req.params.tourId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Reviews fetched successfully",
        statusCode: http_status_codes_1.default.OK,
        data,
    });
}));
const getTopReviews = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.reviewService.getTopReviews();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Reviews fetched successfully",
        statusCode: http_status_codes_1.default.OK,
        data,
    });
}));
exports.reviewController = { addReview, getReviewsByTour, updateReview, getTopReviews };
