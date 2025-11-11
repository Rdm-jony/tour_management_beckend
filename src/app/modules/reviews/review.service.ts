import AppError from "../../errorHelpers/AppError";
import { Tour } from "../tour/tour.model";
import { IReview } from "./review.interface";
import httpStatusCode from "http-status-codes"
import { Review } from "./review.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";

const addReview = async (payload: Partial<IReview>) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate Tour
        const findTour = await Tour.findById(payload.tour).session(session);
        if (!findTour) {
            throw new AppError(httpStatusCode.NOT_FOUND, "Tour not found");
        }

        // Validate User
        const findUser = await User.findById(payload.user).session(session);
        if (!findUser) {
            throw new AppError(httpStatusCode.NOT_FOUND, "User not found");
        }

        //  Duplicate Review
        const existingReview = await Review.findOne({
            tour: payload.tour,
            user: payload.user,
        }).session(session);
        if (existingReview) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "You have already reviewed this tour");
        }

        //  Create Review
        const [review] = await Review.create([payload], { session });

        // Recalculate average rating (fetch all reviews including new one)
        const allReviews = await Review.find({ tour: payload.tour }).session(session);
        const totalReviews = allReviews.length;
        const avgRating =
            totalReviews === 0
                ? 0
                : allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

        await Tour.findByIdAndUpdate(
            payload.tour,
            {
                averageRating: avgRating,
                totalReviews,
            },
            { session }
        );

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return review;
    } catch (error) {
        //  Rollback on failure
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const updateReview = async (payload: Partial<IReview>) => {
    if (!payload._id) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Review ID is required");
    }

    const review = await Review.findById(payload._id);
    if (!review) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Review not found");
    }

    if (payload.rating !== undefined) review.rating = payload.rating;
    if (payload.comment !== undefined) review.comment = payload.comment;

    await review.save();

    return review;
};



const getReviewsByTour = async (tourId: string) => {
    const reviews = await Review.find({ tour: tourId })
        .populate("user", "name email picture")
        .sort({ createdAt: -1 });
    return reviews;
};

const getTopReviews = async () => {
    const reviews = await Review.find({ rating: 5 })
        .populate("user", "name email picture")
    return reviews;
}

export const reviewService = { addReview, getReviewsByTour, updateReview,getTopReviews }