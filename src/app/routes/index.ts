import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";

export const router = Router()

const moduleRputes = [
    {
        route: "/user",
        path: userRoutes
    }
]

moduleRputes.forEach(route => router.use(route.route, route.path))