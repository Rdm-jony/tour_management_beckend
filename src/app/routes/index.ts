import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { divisonRoutes } from "../modules/division/division.route";
import { tourRoutes } from "../modules/tour/tour.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { otpRoutes } from "../modules/otp/otp.route";
import { reviewRoutes } from "../modules/reviews/review.route";

export const router = Router()

const moduleRputes = [
    {
        route: "/user",
        path: userRoutes
    },
    {
        route: "/auth",
        path: authRoutes
    },
    {
        route: "/otp",
        path: otpRoutes
    },
    {
        route: "/division",
        path: divisonRoutes
    },
    {
        route: "/tour",
        path: tourRoutes
    },
    {
        route: "/booking",
        path: bookingRoutes
    },
    {
        route: "/payment",
        path: paymentRoutes
    },
    {
        route: "/review",
        path: reviewRoutes
    }
]

moduleRputes.forEach(route => router.use(route.route, route.path))