/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"

 const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userServices.creteUser(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.CREATED,
        message: "user create successfully",
        data: user,
    })
});

 const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userServices.getAllUser()
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "user create successfully",
        data: user.user,
        meta: {
            total: user.total
        }
    })
})

export const userControllers = { createUser,getAllUser }