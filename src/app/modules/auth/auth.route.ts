import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import passport from "passport";

const router = Router()

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.get("/google", AuthControllers.googlePassport);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `/login`,
    }),
    AuthControllers.googleCallback
);

export const authRoutes = router