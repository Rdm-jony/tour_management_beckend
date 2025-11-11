import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>({
    comment: { type: String, required: true },
    rating: { type: Number, required: true, default: 1 },
    tour: { type: Schema.Types.ObjectId, ref: "Tour", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
},{
    timestamps:true
})

export const Review = model("Review", reviewSchema)