import AppError from "../../errorHelpers/AppError";
import { Tour } from "../tour/tour.model";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatusCode from "http-status-codes"

const createDivision = async (payload: Partial<IDivision>) => {
    payload.slug = payload.name?.split(" ").join("-").toLowerCase()
    const newDivision = await Division.create(payload)
    return {
        newDivision
    }
}

const getDivision = async () => {
    const getDivisions = await Division.find({})
    return {
        getDivisions
    }
}

const updateDivision = async (divisionId: string, payload: Partial<IDivision>) => {
    const findDivision = await Division.findById(divisionId)
    if (!findDivision) {
        throw new AppError(httpStatusCode.NOT_FOUND, "divison not found.Use valid objectId")
    }
    payload.slug = payload.name?.split(" ").join("-").toLowerCase()
    const updatedDivision = await Division.findByIdAndUpdate(divisionId, payload, { new: true, runValidators: true })
    return {
        updatedDivision
    }
}

const deleteDivision = async (divisionId: string) => {
    const findDivision = await Division.findById(divisionId)
    if (!findDivision) {
        throw new AppError(httpStatusCode.NOT_FOUND, "divison not found.Use valid objectId")
    }

    const isExistInTour = await Tour.findOne({ division: divisionId })
    if (isExistInTour) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "This division exists in tours. Cannot delete.");
    }
    await Division.findByIdAndDelete(divisionId)

}

export const divisionServices = { createDivision, getDivision, updateDivision, deleteDivision }