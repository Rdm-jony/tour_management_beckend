/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorResponse, TErrorSource } from "../interfaces/errorTypes"

export const handleValidationError = (err: any): TErrorResponse => {
    const errorSources: TErrorSource[] = []
    const errors = Object.values(err.errors)
    errors.forEach((errorObject: any) => errorSources.push({
        path: errorObject.path,
        message: errorObject.message
    }))
    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources: errorSources
    }
}