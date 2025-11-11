import { Request, Response } from "express";
import { reviewService } from "./review.service";
import httpStatusCode from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const addReview = catchAsync(async (req: Request, res: Response) => {
    const data = await reviewService.addReview({
        ...req.body,
        user: (req.user as JwtPayload).userId,
    });

    sendResponse(res, {
        success: true,
        message: "Review added successfully",
        statusCode: httpStatusCode.CREATED,
        data,
    });
});
const updateReview = catchAsync(async (req: Request, res: Response) => {
    const data = await reviewService.updateReview({
        ...req.body,
        _id: req.params.reviewId,
        user: (req.user as JwtPayload).userId,
    });

    sendResponse(res, {
        success: true,
        message: "Review updated successfully",
        statusCode: httpStatusCode.OK,
        data,
    });
});

const getReviewsByTour = catchAsync(async (req: Request, res: Response) => {
    const data = await reviewService.getReviewsByTour(req.params.tourId);

    sendResponse(res, {
        success: true,
        message: "Reviews fetched successfully",
        statusCode: httpStatusCode.OK,
        data,
    });
});
const getTopReviews = catchAsync(async (req: Request, res: Response) => {
    const data = await reviewService.getTopReviews();

    sendResponse(res, {
        success: true,
        message: "Reviews fetched successfully",
        statusCode: httpStatusCode.OK,
        data,
    });
});

export const reviewController = { addReview, getReviewsByTour, updateReview ,getTopReviews}

