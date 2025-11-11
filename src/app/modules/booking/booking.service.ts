/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import httpStatusCode from "http-status-codes"
import { Booking } from "./booking.model";
import { Tour } from "../tour/tour.model";
import { Payment } from "../payment/payment.model";
import mongoose from "mongoose";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.random() * 1000}`
}

const createBooking = async (userId: string, payload: Partial<IBooking>) => {
    const transactionId = getTransactionId()
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const user = await User.findById(userId)
        if (!user?.phone) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "phone number is required. Update your profile")
        }
        if (!user?.address) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "phone number is required. Update your profile")
        }

        const tour = await Tour.findById(payload.tour)
        const amount = Number(tour?.costForm) * Number(payload.guestCount)

        if (!tour?.costForm) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "No Tour Cost Found!")
        }

        const booking = await Booking.create([{
            ...payload,
            user: userId,
        }], { session })

        const payment = await Payment.create([{
            booking: booking[0]._id,
            amount: amount,
            transactionId: transactionId,
        }], { session })

        const updatedBooking = await Booking.findByIdAndUpdate(booking[0]._id, {
            payment: payment[0]._id
        }, {
            new: true,
            runValidators: true,
            session
        })
        const userAddress = (updatedBooking?.user as any).address
        const userEmail = (updatedBooking?.user as any).email
        const userPhoneNumber = (updatedBooking?.user as any).phone
        const userName = (updatedBooking?.user as any).name

        const sslPayload: ISSLCommerz = {
            address: userAddress,
            email: userEmail,
            phone: userPhoneNumber,
            name: userName,
            amount: amount,
            transactionId: transactionId
        }

        const response = await SSLService.sslPaymentInit(sslPayload)
        await session.commitTransaction()//transaction
        session.endSession()
        return {
            paymentURL: response.GatewayPageURL
        }
    } catch (error) {
        await session.abortTransaction()//rollback
        session.endSession()
        throw error
    }
}

const getMyBookings = async (userId: string) => {
    const findUser = await User.findById(userId)
    if (!findUser) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user not found")
    }

    const bookings = await Booking.find({ user: userId }).populate("user").populate("payment").populate("tour")
    return bookings;

}

export const bookingServices = { createBooking, getMyBookings }