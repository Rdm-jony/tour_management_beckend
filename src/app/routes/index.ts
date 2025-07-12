import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";

export const router = Router()

const moduleRputes = [
    {
        route: "/user",
        path: userRoutes
    },
    {
        route: "/auth",
        path: authRoutes
    }
]

moduleRputes.forEach(route => router.use(route.route, route.path))