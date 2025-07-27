/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose"
import { BOOKING_STATUS } from "../booking/booking.interface"
import { Booking } from "../booking/booking.model"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"
import httpStatusCode from "http-status-codes"
import AppError from "../../errorHelpers/AppError"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { SSLService } from "../sslCommerz/sslCommerz.service"
import { generateInvoiceBuffer } from "../../utils/invoice"
import { IUser } from "../user/user.interface"
import { sendMail } from "../../utils/sendMail"
import { ITour } from "../tour/tour.interface"
import { uploadBufferToCloudinary } from "../../config/cloudinary.confilg"

const initRePayment = async (bookingId: string) => {
    const payment = await Payment.findOne({ booking: bookingId })
    if (!payment) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    }
    const booking = await Booking.findById(payment.booking)
    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name
    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phone: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }
    const response = await SSLService.sslPaymentInit(sslPayload)
    return {
        paymentURL: response.GatewayPageURL
    }
}

const successPayment = async (query: Record<string, string>) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID
        }, { new: true, session })

        const updatedBooking = await Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: BOOKING_STATUS.COMPLETE
        }, { new: true, session }).populate("user", "email name").populate("tour", "title")
        // if(!updatedBooking){
        //     throw new AppError(401,"booking update and payment failed!")
        // }
        const invoiceData = {
            customerEmail: (updatedBooking?.user as unknown as IUser).email,
            customerName: (updatedBooking?.user as unknown as IUser).name,
            date: updatedBooking?.createdAt as Date,
            total: Number(updatedPayment?.amount),
            transactionId: updatedPayment?.transactionId as string,
            guestCount: updatedBooking?.guestCount as number,
            tourName: (updatedBooking?.tour as unknown as ITour).title

        }
        const pdfBuffer = await generateInvoiceBuffer(invoiceData)
        const response = await uploadBufferToCloudinary(pdfBuffer, "invoive")
        await Payment.findByIdAndUpdate(updatedBooking?.payment, { invoiceUrl: response?.secure_url },{session})
        await sendMail({
            subject: "Download your invoice",
            templateName: 'invoice',
            templateData: invoiceData,
            to: (updatedBooking?.user as unknown as IUser).email,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        })
        await session.commitTransaction()
        session.endSession()
        return { success: true, message: "Payment Completed Successfully" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error;
    }

}
const cancelPayment = async (query: Record<string, string>) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCELLED
        }, { session })

        await Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: BOOKING_STATUS.CANCEL
        }, { session })
        await session.commitTransaction()
        session.endSession()
        return { success: false, message: "Payment cancelled" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error;
    }

}
const failPayment = async (query: Record<string, string>) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.FAILED
        }, { session })

        await Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: BOOKING_STATUS.FAILED
        }, { session })
        await session.commitTransaction()
        session.endSession()
        return { success: false, message: "Payment failed" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error;
    }

}

export const paymentServices = {
    successPayment,
    cancelPayment,
    failPayment,
    initRePayment
}