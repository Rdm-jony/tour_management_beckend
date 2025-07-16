export interface TErrorSource{
    path:string,
    message:string
}

export interface TErrorResponse {
    statusCode: number,
    message:string,
    errorSources?:TErrorSource[],
}