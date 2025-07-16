import { envVars } from "../config/env"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import bcrypt from "bcryptjs"

export const seedSuperAdmin = async () => {
    const isUserExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
    if (isUserExist) {
        console.log("super admin already exist!")
        return;
    }

    const authProvider: IAuthProvider = {
        provider: "Credential",
        providerId: envVars.SUPER_ADMIN_EMAIL
    }

    const hashPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, 10)

    const payload: IUser = {
        name: "Super admin",
        email: envVars.SUPER_ADMIN_EMAIL,
        password: hashPassword,
        role: Role.SUPERADMIN,
        isVerified: true,
        auths: [authProvider]
    }

    const superadmin = await User.create(payload)
    console.log("Super Admin Created Successfuly! \n");
    console.log(superadmin);
}