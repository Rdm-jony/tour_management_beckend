import { TErrorResponse, TErrorSource } from "../interfaces/errorTypes"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleZodeError = (err: any): TErrorResponse => {
    const errorSources: TErrorSource[] = []
    err.issues.forEach((errorObject: any) => errorSources.push({
        path:errorObject.path.length>1?errorObject.path.reverse().join(" inside "):errorObject.path[0],
        message: errorObject.message
    }))

    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    }

}