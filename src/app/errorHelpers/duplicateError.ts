/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorResponse } from "../interfaces/errorTypes"

export const handleDuplicateError = (err: any): TErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/)
    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!`
    }
}