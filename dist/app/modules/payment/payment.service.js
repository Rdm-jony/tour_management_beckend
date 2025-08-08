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
exports.paymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const invoice_1 = require("../../utils/invoice");
const sendMail_1 = require("../../utils/sendMail");
const cloudinary_confilg_1 = require("../../config/cloudinary.confilg");
const initRePayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment Not Found. You have not booked this tour");
    }
    const booking = yield booking_model_1.Booking.findById(payment.booking);
    const userAddress = (booking === null || booking === void 0 ? void 0 : booking.user).address;
    const userEmail = (booking === null || booking === void 0 ? void 0 : booking.user).email;
    const userPhoneNumber = (booking === null || booking === void 0 ? void 0 : booking.user).phone;
    const userName = (booking === null || booking === void 0 ? void 0 : booking.user).name;
    const sslPayload = {
        address: userAddress,
        email: userEmail,
        phone: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    };
    const response = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
    return {
        paymentURL: response.GatewayPageURL
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.PAID
        }, { new: true, session });
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, {
            status: booking_interface_1.BOOKING_STATUS.COMPLETE
        }, { new: true, session }).populate("user", "email name").populate("tour", "title");
        // if(!updatedBooking){
        //     throw new AppError(401,"booking update and payment failed!")
        // }
        const invoiceData = {
            customerEmail: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email,
            customerName: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).name,
            date: updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.createdAt,
            total: Number(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.amount),
            transactionId: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.transactionId,
            guestCount: updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.guestCount,
            tourName: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.tour).title
        };
        const pdfBuffer = yield (0, invoice_1.generateInvoiceBuffer)(invoiceData);
        const response = yield (0, cloudinary_confilg_1.uploadBufferToCloudinary)(pdfBuffer, "invoive");
        yield payment_model_1.Payment.findByIdAndUpdate(updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.payment, { invoiceUrl: response === null || response === void 0 ? void 0 : response.secure_url }, { session });
        yield (0, sendMail_1.sendMail)({
            subject: "Download your invoice",
            templateName: 'invoice',
            templateData: invoiceData,
            to: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        });
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment Completed Successfully" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.CANCELLED
        }, { session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, {
            status: booking_interface_1.BOOKING_STATUS.CANCEL
        }, { session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment cancelled" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.FAILED
        }, { session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, {
            status: booking_interface_1.BOOKING_STATUS.FAILED
        }, { session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment failed" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.paymentServices = {
    successPayment,
    cancelPayment,
    failPayment,
    initRePayment
};
