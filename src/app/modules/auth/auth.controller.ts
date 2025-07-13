/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { AuthServices } from "./auth.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatusCode from "http-status-codes"
import { setAuthCookie } from "../../utils/setCookies"
import AppError from "../../errorHelpers/AppError"
import { createUserTokens } from "../../utils/userTokens"
import { envVars } from "../../config/env"
import passport from "passport"


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body)
    setAuthCookie(res, loginInfo)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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


const googlePassport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: req.query?.redirect as string || "/"
    })(req, res, next)
})

const googleCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user
    let redirectTo = req.query.state ? req.query.state as string : ""
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    if (!user) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user Not Found")
    }

    const tokenInfo = createUserTokens(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONT_END_URL}/${redirectTo}`)
})




export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    googlePassport,
    googleCallback
}
