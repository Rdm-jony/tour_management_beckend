import { TErrorResponse } from "../interfaces/errorTypes"

export const handleCastError = (): TErrorResponse => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectID. Please provide a valid id"
    }
}