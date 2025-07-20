import { Response } from "express"

interface TMeta{
    total?: number,
    page?:number,
    limit?:number,
    totalPage?:number
}

interface TResponse<T> {
    success: boolean,
    message: string,
    statusCode: number,
    data: T,
    meta?: TMeta
}

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data.statusCode).json({
        success:data.success,
        statusCode:data.statusCode,
        message:data.message,
        data:data.data,
        meta:data.meta
    })
}