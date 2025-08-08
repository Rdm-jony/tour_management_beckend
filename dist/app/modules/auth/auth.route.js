"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const passport_1 = __importDefault(require("passport"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_validation_1 = require("./auth.validation");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.AuthControllers.credentialsLogin);
router.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccessToken);
router.get("/google", auth_controller_1.AuthControllers.googlePassport);
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: `/login`,
}), auth_controller_1.AuthControllers.googleCallback);
router.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, validateRequest_1.validateRequest)(auth_validation_1.changePasswordShema), auth_controller_1.AuthControllers.changePassword);
router.post("/set-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, validateRequest_1.validateRequest)(auth_validation_1.setPasswordShema), auth_controller_1.AuthControllers.setPassword);
router.post("/logout", auth_controller_1.AuthControllers.logout);
router.post("/forget-password", (0, validateRequest_1.validateRequest)(auth_validation_1.forgetPasswordSchema), auth_controller_1.AuthControllers.forgetPassword);
router.post("/reset-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, validateRequest_1.validateRequest)(auth_validation_1.resetPasswordSchema), auth_controller_1.AuthControllers.resetPassword);
exports.authRoutes = router;
