import { Types } from "mongoose";

export interface ITourType{
    name:string,
    image?:string,
    slug:string
}

export interface ITour {
    title: string;
    slug: string;
    description?: string;
    images?: string[];
    location?:string;
    costForm?:number;
    lat?:string;
    lng?:string;
    included?:string[];
    excluded?:string[];
    amenities?:string[];
    tourPlan?:string[];
    maxGuest?:number;
    minAge?:number;
    videoUrl?:string;
    deletedImages?:string[];
    division:Types.ObjectId;
    tourType:Types.ObjectId;
    totalReviews?:number,
    averageRating?:number
}