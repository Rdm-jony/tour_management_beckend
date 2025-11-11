import mongoose from "mongoose";

export interface IReview {
  _id?: string;
  user: mongoose.Types.ObjectId;
  tour: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}
