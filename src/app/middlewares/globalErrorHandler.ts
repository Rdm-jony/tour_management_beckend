/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"
import {  TErrorSource } from "../interfaces/errorTypes"
import { handleValidationError } from "../errorHelpers/validattionError"
import { handleDuplicateError } from "../errorHelpers/duplicateError"
import { handleCastError } from "../errorHelpers/castError"
import { handleZodeError } from "../errorHelpers/zodError"


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500
    let message = "something went wrong!"

    let errorSources: TErrorSource[] = []
    if (err.name === "ValidationError") {
        const simplyfiedError = handleValidationError(err)
        statusCode = simplyfiedError.statusCode
        message = simplyfiedError.message
        errorSources = simplyfiedError.errorSources as TErrorSource[]
    }
    else if (err.code == 11000) {
        const simplyfiedError = handleDuplicateError(err)
        statusCode = simplyfiedError.statusCode
        message = simplyfiedError.message
    }
    else if (err.name === "CastError") {
        const simplyfiedError = handleCastError()
        statusCode = simplyfiedError.statusCode
        message = simplyfiedError.message
    }
    else if (err.name === 'ZodError') {
        const simplyfiedError = handleZodeError(err)
        statusCode = simplyfiedError.statusCode;
        message = simplyfiedError.message;
        errorSources=simplyfiedError.errorSources as TErrorSource[]
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500
        message = err.message
    }
    res.status(statusCode).json({
        message,
        errorSources,
        err: envVars.NODE_ENV == "development" ? err : null,
        stack: envVars.NODE_ENV == "development" ? err.stack : null
    })
}
