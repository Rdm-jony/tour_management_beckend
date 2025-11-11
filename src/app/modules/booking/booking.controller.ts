/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"

const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const booking = await bookingServices.createBooking(decodedToken.userId, req.body)

    sendResponse(res, {
        data: booking,
        message: "create booking successfully",
        success: true,
        statusCode: httpStatusCode.CREATED
    })
})
const getMyBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const bookings = await bookingServices.getMyBookings(decodedToken.userId)

    sendResponse(res, {
        data: bookings,
        message: "Retrived booking successfully",
        success: true,
        statusCode: httpStatusCode.OK
    })
})

export const bookingController = {
    createBooking,
    getMyBookings
}