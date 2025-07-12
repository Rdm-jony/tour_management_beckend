import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { AuthServices } from "./auth.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatusCode from "http-status-codes"
import { setAuthCookie } from "../../utils/setCookies"
import AppError from "../../errorHelpers/AppError"


const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body)
    setAuthCookie(res, loginInfo)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "No refresh token recieved from cookies")
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    setAuthCookie(res, tokenInfo)
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    })
})


export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}
