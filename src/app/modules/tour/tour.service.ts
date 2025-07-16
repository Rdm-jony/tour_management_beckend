import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatusCode from "http-status-codes"

const createTourType = async (payload: Partial<ITourType>) => {
    payload.slug = payload.name?.split(" ").join("-").toLowerCase()
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
    payload.slug = payload.name?.split(" ").join("-").toLowerCase()

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
    payload.slug = payload.title?.split(" ").join("-").toLowerCase()

    const newTour = await Tour.create(payload)

    return { newTour }
}
export const tourServices = { createTourType, getTourTypes, updateTourType, deleteTourType, createTour }