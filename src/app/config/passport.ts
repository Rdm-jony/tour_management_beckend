/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport"
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs"

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email: string, password: string, done: any) => {

    try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
            return done("User does not exist")
        }
        const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

        if (!isPasswordMatched) {
            return done("Password does not match")
        }
        
        if (!isUserExist.isVerified) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
            return done("User is not verified")
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
            return done(`User is ${isUserExist.isActive}`)
        }
        if (isUserExist.isDeleted) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
            return done("User is deleted")
        }


        const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "Google")

        if (isGoogleAuthenticated && !isUserExist.password) {
            return done("You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.")
        }


        return done(null, isUserExist)

    } catch (error) {
        console.log(error)
        done(error)
    }
}))

//google strategy
passport.use(new GoogleStrategy({
    clientID: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: envVars.CALLBACK_URL
}, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
        const email = profile.emails?.[0].value
        if (!email) {
            return done(null, false, { message: "email not found" })
        }

        let isUserExist = await User.findOne({ email })


        if (!isUserExist) {
            isUserExist = await User.create({
                name: profile?.displayName,
                email: profile?.emails?.[0].value,
                picture: profile?.photos?.[0].value,
                role: Role.USER,
                isVerified: true,
                auths: [
                    {
                        provider: "Google",
                        providerId: profile?.id
                    }
                ]
            })
        }

        if (!isUserExist.isVerified) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
            return done("User is not verified")
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
            return done(`User is ${isUserExist.isActive}`)
        }
        if (isUserExist.isDeleted) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
            return done("User is deleted")
        }


        return done(null, isUserExist)
    } catch (error) {
        console.log(error)
        done(error)
    }
}
))

passport.serializeUser((user: any, done: VerifyCallback) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);

    } catch (error) {
        done(error);
    }
})

export default passport;
