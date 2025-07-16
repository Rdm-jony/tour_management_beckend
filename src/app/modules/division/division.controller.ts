/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { divisionServices } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"

const createDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const division = await divisionServices.createDivision(req.body)
    sendResponse(res, {
        data: division.newDivision,
        message: "division create successFully",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
})

const getDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const division = await divisionServices.getDivision()
    sendResponse(res, {
        data: division.getDivisions,
        message: "division retrived successFully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const updateDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const divisionId=req.params.id
    const division = await divisionServices.updateDivision(divisionId,req.body)
    sendResponse(res, {
        data: division.updatedDivision,
        message: "division updated successFully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const deleteDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const divisionId=req.params.id
    const division = await divisionServices.deleteDivision(divisionId)
    sendResponse(res, {
        data: division,
        message: "division deleted successFully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})

export const divisionControllers = {
    createDivision,
    getDivision,
    updateDivision,
    deleteDivision
}