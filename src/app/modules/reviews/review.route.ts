import express from "express";
import { reviewController } from "./review.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewCreateSchema, reviewUpdateSchema } from "./review.validation";

const router = express.Router();

router.get("/top", reviewController.getTopReviews)
router.get("/:tourId", reviewController.getReviewsByTour);
router.patch("/:reviewId", checkAuth(Role.USER), validateRequest(reviewUpdateSchema), reviewController.updateReview)
router.post("/create", checkAuth(Role.USER), validateRequest(reviewCreateSchema), reviewController.addReview);

export const reviewRoutes = router;
