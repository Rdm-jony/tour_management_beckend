import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import htttpStatusCode from "http-status-codes"
import bcrypt from "bcryptjs"
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload
    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(htttpStatusCode.BAD_REQUEST, "Email does not exist")
    }
    const isPasswordMatch = await bcrypt.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatch) {
        throw new AppError(htttpStatusCode.BAD_REQUEST, "Incorrect Password")
    }
    const userTokens = createUserTokens(isUserExist)

    const userWithoutPass = await User.findOne({ email }).select("-password")

    return {
        user: userWithoutPass,
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken
    }
}

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken
}