/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { divisionServices } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"

const createDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    const division = await divisionServices.createDivision(req.body)
    sendResponse(res, {
        data: division,
        message: "division create successFully",
        statusCode:httpStatusCode.CREATED,
        success:true
    })
})

export const divisionControllers={
    createDivision
}