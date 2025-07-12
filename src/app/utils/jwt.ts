import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

export const generateToken = (payload: JwtPayload,secret_token:string,expiresIn:string) => {
    const token = jwt.sign(payload, secret_token, { expiresIn: expiresIn } as SignOptions)
    return token;
}

export const verifyToken = (token: string,secret_token:string) => {
    const verifyToken = jwt.verify(token, secret_token)
    return verifyToken;
}