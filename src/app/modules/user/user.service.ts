import { IUser } from "./user.interface";
import { User } from "./user.model";

export const creteUser = async (payload: Partial<IUser>) => {

    const { name, email } = payload
    const user = await User.create({ email, name })
    return user;
}

export const getAllUser = async () => {
    const user = await User.find({})
    const total = await User.countDocuments()

    return {
        user,
        total
    }
}

export const userServices = {
    creteUser,
    getAllUser
}