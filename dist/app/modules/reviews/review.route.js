"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
router.get("/top", review_controller_1.reviewController.getTopReviews);
router.get("/:tourId", review_controller_1.reviewController.getReviewsByTour);
router.patch("/:reviewId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(review_validation_1.reviewUpdateSchema), review_controller_1.reviewController.updateReview);
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(review_validation_1.reviewCreateSchema), review_controller_1.reviewController.addReview);
exports.reviewRoutes = router;
