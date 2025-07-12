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

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId=req.params.id
    const payload=req.body
    const decodedToken=req.user
    const user = await userServices.updateUser(userId,payload,decodedToken);
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.CREATED,
        message: "user update successfully",
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

export const userControllers = { createUser, getAllUser,updateUser }