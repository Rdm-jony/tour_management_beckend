import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { changePasswordShema, forgetPasswordSchema, resetPasswordSchema, setPasswordShema } from "./auth.validation";
import { Role } from "../user/user.interface";

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
router.post("/change-password", checkAuth(...Object.values(Role)), validateRequest(changePasswordShema), AuthControllers.changePassword)
router.post("/set-password", checkAuth(...Object.values(Role)), validateRequest(setPasswordShema), AuthControllers.setPassword)
router.post("/logout", AuthControllers.logout)
router.post("/forget-password",validateRequest(forgetPasswordSchema), AuthControllers.forgetPassword)
router.post("/reset-password",checkAuth(...Object.values(Role)),validateRequest(resetPasswordSchema), AuthControllers.resetPassword)

export const authRoutes = router