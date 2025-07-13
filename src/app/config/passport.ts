/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport"
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";


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

        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
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
        return done(null, user)
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
