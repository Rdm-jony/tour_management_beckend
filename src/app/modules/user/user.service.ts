import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import htttpStatusCode from "http-status-codes"
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.confilg";

const creteUser = async (payload: Partial<IUser>) => {

    const { email, password, ...rest } = payload
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(htttpStatusCode.BAD_REQUEST, "user already exists")
    }

    const hashPassword = await bcrypt.hash(password as string, 10)

    const authProvider: IAuthProvider = { provider: "Credential", providerId: email as string }

    const user = await User.create({ email, password: hashPassword, auths: [authProvider], ...rest })
    return user;
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const isUserExist = await User.findById(userId)
    if (!isUserExist) {
        throw new AppError(htttpStatusCode.FORBIDDEN, "You are not authorized")
    }
    if (payload.role) {
        if (decodedToken.role == Role.USER || decodedToken.role == Role.GUIDE) {
            throw new AppError(htttpStatusCode.FORBIDDEN, "You are not authorized")
        }

        if (payload.role == Role.SUPERADMIN && decodedToken.role == Role.ADMIN) {
            throw new AppError(htttpStatusCode.FORBIDDEN, "You are not authorized")

        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(htttpStatusCode.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 10)
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
    if (isUserExist.picture) {
        await deleteImageFromCLoudinary(isUserExist.picture)
    }

    return newUpdateUser
}

const getAllUser = async () => {
    const user = await User.find({})
    const total = await User.countDocuments()

    return {
        user,
        total
    }
}

export const userServices = {
    creteUser,
    getAllUser,
    updateUser
}