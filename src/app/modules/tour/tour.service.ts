import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatusCode from "http-status-codes"
import { tourSearChQueryFields } from "./tour.contsant";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createTourType = async (payload: Partial<ITourType>) => {
    const newTourType = await TourType.create(payload)
    return {
        newTourType
    }
}

const getTourTypes = async () => {
    const getTourTypes = await TourType.find({})

    return {
        getTourTypes
    }

}

const updateTourType = async (tourTypeId: string, payload: Partial<ITourType>) => {
    const findTourType = await TourType.findById(tourTypeId)
    if (!findTourType) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour type not found")
    }

    const updatedTourType = await TourType.findByIdAndUpdate(tourTypeId, payload, { new: true, runValidators: true })

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
        .build()
        
    const meta = await queryBuilder.getMeta()

    return {
        getTours,
        meta
    }
}

const updateTour = async (tourId: string, payload: Partial<ITour>) => {
    const findTour = await Tour.findById(tourId)
    if (!findTour) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour is not found")
    }
    const updatedTour = await Tour.findByIdAndUpdate(tourId, payload, { new: true, runValidators: true })

    return {
        updatedTour
    }
}

const deleteTour = async (tourId: string) => {
    const findTour = await Tour.findById(tourId)
    if (!findTour) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour is not found")
    }

    await Tour.findByIdAndDelete(tourId)
}
export const tourServices = { createTourType, getTourTypes, updateTourType, deleteTourType, createTour, getAllTour, updateTour, deleteTour }