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
exports.bookingServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_model_1 = require("./booking.model");
const tour_model_1 = require("../tour/tour.model");
const payment_model_1 = require("../payment/payment.model");
const mongoose_1 = __importDefault(require("mongoose"));
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.random() * 1000}`;
};
const createBooking = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = getTransactionId();
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!(user === null || user === void 0 ? void 0 : user.phone)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "phone number is required. Update your profile");
        }
        if (!(user === null || user === void 0 ? void 0 : user.address)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "phone number is required. Update your profile");
        }
        const tour = yield tour_model_1.Tour.findById(payload.tour);
        const amount = Number(tour === null || tour === void 0 ? void 0 : tour.costForm) * Number(payload.guestCount);
        if (!(tour === null || tour === void 0 ? void 0 : tour.costForm)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No Tour Cost Found!");
        }
        const booking = yield booking_model_1.Booking.create([Object.assign(Object.assign({}, payload), { user: userId })], { session });
        const payment = yield payment_model_1.Payment.create([{
                booking: booking[0]._id,
                amount: amount,
                transactionId: transactionId,
            }], { session });
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(booking[0]._id, {
            payment: payment[0]._id
        }, {
            new: true,
            runValidators: true,
            session
        });
        const userAddress = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).address;
        const userEmail = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email;
        const userPhoneNumber = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).phone;
        const userName = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).name;
        const sslPayload = {
            address: userAddress,
            email: userEmail,
            phone: userPhoneNumber,
            name: userName,
            amount: amount,
            transactionId: transactionId
        };
        const response = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        yield session.commitTransaction(); //transaction
        session.endSession();
        return {
            paymentURL: response.GatewayPageURL
        };
    }
    catch (error) {
        yield session.abortTransaction(); //rollback
        session.endSession();
        throw error;
    }
});
const getMyBookings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield user_model_1.User.findById(userId);
    if (!findUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found");
    }
    const bookings = yield booking_model_1.Booking.find({ user: userId }).populate("user").populate("payment").populate("tour");
    return bookings;
});
exports.bookingServices = { createBooking, getMyBookings };
