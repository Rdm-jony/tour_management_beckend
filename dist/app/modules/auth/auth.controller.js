"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const setCookies_1 = require("../../utils/setCookies");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const userTokens_1 = require("../../utils/userTokens");
const env_1 = require("../../config/env");
const passport_1 = __importDefault(require("passport"));
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new AppError_1.default(401, err));
        }
        delete user.toObject().password;
        const userTokens = (0, userTokens_1.createUserTokens)(user);
        (0, setCookies_1.setAuthCookie)(res, userTokens);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "User Logged In Successfully",
            data: user,
        });
    }))(req, res, next);
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No refresh token recieved from cookies");
    }
    const tokenInfo = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    (0, setCookies_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    });
}));
const googlePassport = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        state: ((_a = req.query) === null || _a === void 0 ? void 0 : _a.redirect) || "/"
    })(req, res, next);
}));
const googleCallback = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req === null || req === void 0 ? void 0 : req.user;
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user Not Found");
    }
    const tokenInfo = (0, userTokens_1.createUserTokens)(user);
    (0, setCookies_1.setAuthCookie)(res, tokenInfo);
    res.redirect(`${env_1.envVars.FRONT_END_URL}/${redirectTo}`);
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    yield auth_service_1.AuthServices.changePassword(newPassword, oldPassword, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password Changed Successfully",
        data: null,
    });
}));
const setPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const plainPassword = req.body.plainPassword;
    yield auth_service_1.AuthServices.setPassword(plainPassword, decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password set Successfully",
        data: null,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Logged Out Successfully",
        data: null,
    });
}));
const forgetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.AuthServices.forgetPassword(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Email Sent Successfully",
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.resetPassword(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "password change Successfully",
        data: null,
    });
}));
exports.AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    googlePassport,
    googleCallback,
    changePassword,
    setPassword,
    logout,
    forgetPassword,
    resetPassword
};
