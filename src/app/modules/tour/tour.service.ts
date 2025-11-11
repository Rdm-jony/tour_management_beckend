import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatusCode from "http-status-codes"
import { tourSearChQueryFields } from "./tour.contsant";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.confilg";

const createTourType = async (payload: Partial<ITourType>) => {
    const newTourType = await TourType.create(payload)
    return {
        newTourType
    }
}

const getTourTypes = async () => {
    const tourTypesWithCount = await TourType.aggregate([
        {
            $lookup: {
                from: "tours", // ✅ collection name (check your model name carefully)
                localField: "_id",
                foreignField: "tourType",
                as: "tours"
            }
        },
        {
            $addFields: {
                totalTours: { $size: "$tours" }
            }
        },
        {
            $project: {
                tours: 0 // tours array hide করে শুধুমাত্র count return করা
            }
        }
    ]);

    return tourTypesWithCount;

}

const updateTourType = async (tourTypeId: string, payload: Partial<ITourType>) => {
    const findTourType = await TourType.findById(tourTypeId)
    if (!findTourType) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour type not found")
    }

    const updatedTourType = await TourType.findByIdAndUpdate(tourTypeId, payload, { new: true, runValidators: true })
    if (findTourType.image && payload.image) {
        await deleteImageFromCLoudinary(findTourType.image)
    }
    return {
        updatedTourType
    }

}

const deleteTourType = async (tourTypeId: string) => {
    const findTourType = await TourType.findById(tourTypeId)
    if (!findTourType) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour type not found")
    }

    const isExistInTour = await Tour.findOne({ tourType: tourTypeId })
    if (isExistInTour) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Tour type exists in tours. Cannot delete.");
    }

    await TourType.findByIdAndDelete(tourTypeId)

    if (findTourType.image) {
        await deleteImageFromCLoudinary(findTourType.image)
    }
}

const createTour = async (payload: Partial<ITour>) => {

    const newTour = await Tour.create(payload)

    return { newTour }
}



const getAllTour = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Tour.find(), query)
    const getTours = await queryBuilder
        .filter()
        .search(tourSearChQueryFields)
        .sort()
        .fields()
        .paginate()
        .build().populate("division").populate("tourType")

    const meta = await queryBuilder.getMeta()

    return {
        getTours,
        meta
    }
}

const getSingleTour = async(tourId: string) => {
    const findTour = await Tour.findById(tourId).populate("tourType").populate("division");
    if (!findTour) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour not found");
    }

    return findTour
}

const updateTour = async (tourId: string, payload: Partial<ITour>) => {
    const findTour = await Tour.findById(tourId);
    if (!findTour) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour not found");
    }

    if (payload.images && payload.images.length > 0) {
        payload.images = [...(findTour.images || []), ...payload.images];
    } else if (!payload.images) {
        payload.images = findTour.images;
    }

    if (payload.deletedImages && payload.deletedImages.length > 0) {
        const remainingImages = (payload.images || []).filter(
            img => !payload.deletedImages?.includes(img)
        );
        payload.images = remainingImages;

        await Promise.all(payload.deletedImages.map(deleteImageFromCLoudinary));
    }

    if (payload.videoUrl === "") {
        delete payload.videoUrl;
    }

    const updatedTour = await Tour.findByIdAndUpdate(tourId, payload, {
        new: true,
        runValidators: true,
    });

    return { updatedTour };
};


const deleteTour = async (tourId: string) => {
    const findTour = await Tour.findById(tourId)
    if (!findTour) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour is not found")
    }

    await Tour.findByIdAndDelete(tourId)
    if (findTour?.images && findTour?.images.length > 0) {
        await Promise.all(findTour.images.map(image => deleteImageFromCLoudinary(image)))
    }
}
export const tourServices = { createTourType, getTourTypes, updateTourType, deleteTourType, createTour, getAllTour, updateTour, deleteTour,getSingleTour }