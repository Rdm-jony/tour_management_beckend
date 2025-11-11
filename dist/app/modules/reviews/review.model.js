"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    comment: { type: String, required: true },
    rating: { type: Number, required: true, default: 1 },
    tour: { type: mongoose_1.Schema.Types.ObjectId, ref: "Tour", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true
});
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
