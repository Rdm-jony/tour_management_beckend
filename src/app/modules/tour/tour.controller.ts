/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"

const createTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await tourServices.createTourType(req.body)
    sendResponse(res, {
        data: tourType.newTourType,
        message: "create tour type successfully",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
})
const getTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await tourServices.getTourTypes()
    sendResponse(res, {
        data: tourType.getTourTypes,
        message: "tour types retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const updateTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id
    const tourType = await tourServices.updateTourType(tourTypeId, req.body)
    sendResponse(res, {
        data: tourType.updatedTourType,
        message: "tour type update successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const deleteTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id
    const tourType = await tourServices.deleteTourType(tourTypeId)
    sendResponse(res, {
        data: tourType,
        message: "tour type deleted successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tour = await tourServices.createTour(req.body)
    sendResponse(res, {
        data: tour.newTour,
        message: "tour created successfully!",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
})
const getAllTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const query=req.query as Record<string,string>
   const tour= await tourServices.getAllTour(query)
    sendResponse(res, {
        data: tour.getTours,
        meta:tour.meta,
        message: "tour retrived successfully!",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const tourId=req.params.id
    const tour = await tourServices.updateTour(tourId,req.body)
    sendResponse(res, {
        data: tour.updatedTour,
        message: "tour updated successfully!",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const tourId=req.params.id
    const tour = await tourServices.deleteTour(tourId)
    sendResponse(res, {
        data: tour,
        message: "tour deleted successfully!",
        statusCode: httpStatusCode.OK,
        success: true
    })
})



export const tourControllers = { createTourType, getTourType, updateTourType, deleteTourType, createTour,getAllTour ,updateTour,deleteTour}