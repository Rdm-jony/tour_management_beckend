/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { JwtPayload } from "jsonwebtoken"


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any) => {
        if (err) {
            return next(new AppError(401, err))
        }

        delete user?.toObject().password
        const userTokens = createUserTokens(user)
        setAuthCookie(res, userTokens)
        sendResponse(res, {
            success: true,
            statusCode: httpStatusCode.OK,
            message: "User Logged In Successfully",
            data: user,
        })

    })(req, res, next)

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

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    await AuthServices.changePassword(newPassword, oldPassword, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})

const setPassword = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const plainPassword = req.body.plainPassword;
    await AuthServices.setPassword(plainPassword, decodedToken.userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Password set Successfully",
        data: null,
    })
})

const logout = catchAsync(async (req: Request, res: Response) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body
    await AuthServices.forgetPassword(email)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Email Sent Successfully",
        data: null,
    })
})
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const decodedToken = req.user as JwtPayload
    await AuthServices.resetPassword(payload, decodedToken)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "password change Successfully",
        data: null,
    })
})



export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    googlePassport,
    googleCallback,
    changePassword,
    setPassword,
    logout,
    forgetPassword,
    resetPassword
}
