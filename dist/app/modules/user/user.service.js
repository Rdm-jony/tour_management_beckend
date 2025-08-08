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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_confilg_1 = require("../../config/cloudinary.confilg");
const creteUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user already exists");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, 10);
    const authProvider = { provider: "Credential", providerId: email };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashPassword, auths: [authProvider] }, rest));
    return user;
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    if (payload.role) {
        if (decodedToken.role == user_interface_1.Role.USER || decodedToken.role == user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
        if (payload.role == user_interface_1.Role.SUPERADMIN && decodedToken.role == user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, 10);
    }
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    if (isUserExist.picture) {
        yield (0, cloudinary_confilg_1.deleteImageFromCLoudinary)(isUserExist.picture);
    }
    return newUpdateUser;
});
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find({});
    const total = yield user_model_1.User.countDocuments();
    return {
        user,
        total
    };
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId).select("-password");
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    return isUserExists;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId).select("-password");
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    return isUserExists;
});
exports.userServices = {
    creteUser,
    getAllUser,
    updateUser,
    getSingleUser,
    getMe
};
