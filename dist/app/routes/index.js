"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const division_route_1 = require("../modules/division/division.route");
const tour_route_1 = require("../modules/tour/tour.route");
const booking_route_1 = require("../modules/booking/booking.route");
const payment_route_1 = require("../modules/payment/payment.route");
exports.router = (0, express_1.Router)();
const moduleRputes = [
    {
        route: "/user",
        path: user_route_1.userRoutes
    },
    {
        route: "/auth",
        path: auth_route_1.authRoutes
    },
    {
        route: "/division",
        path: division_route_1.divisonRoutes
    },
    {
        route: "/tour",
        path: tour_route_1.tourRoutes
    },
    {
        route: "/booking",
        path: booking_route_1.bookingRoutes
    },
    {
        route: "/payment",
        path: payment_route_1.paymentRoutes
    }
];
moduleRputes.forEach(route => exports.router.use(route.route, route.path));
