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
exports.reviewService = exports.updateReview = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const tour_model_1 = require("../tour/tour.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const review_model_1 = require("./review.model");
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const addReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Validate Tour
        const findTour = yield tour_model_1.Tour.findById(payload.tour).session(session);
        if (!findTour) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour not found");
        }
        // Validate User
        const findUser = yield user_model_1.User.findById(payload.user).session(session);
        if (!findUser) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        //  Duplicate Review
        const existingReview = yield review_model_1.Review.findOne({
            tour: payload.tour,
            user: payload.user,
        }).session(session);
        if (existingReview) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already reviewed this tour");
        }
        //  Create Review
        const [review] = yield review_model_1.Review.create([payload], { session });
        // Recalculate average rating (fetch all reviews including new one)
        const allReviews = yield review_model_1.Review.find({ tour: payload.tour }).session(session);
        const totalReviews = allReviews.length;
        const avgRating = totalReviews === 0
            ? 0
            : allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
        yield tour_model_1.Tour.findByIdAndUpdate(payload.tour, {
            averageRating: avgRating,
            totalReviews,
        }, { session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return review;
    }
    catch (error) {
        //  Rollback on failure
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload._id) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Review ID is required");
    }
    const review = yield review_model_1.Review.findById(payload._id);
    if (!review) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Review not found");
    }
    if (payload.rating !== undefined)
        review.rating = payload.rating;
    if (payload.comment !== undefined)
        review.comment = payload.comment;
    yield review.save();
    return review;
});
exports.updateReview = updateReview;
const getReviewsByTour = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find({ tour: tourId })
        .populate("user", "name email picture")
        .sort({ createdAt: -1 });
    return reviews;
});
const getTopReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find({ rating: 5 })
        .populate("user", "name email picture");
    return reviews;
});
exports.reviewService = { addReview, getReviewsByTour, updateReview: exports.updateReview, getTopReviews };
