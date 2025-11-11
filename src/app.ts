/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from "express"
import cors from "cors"
import { router } from "./app/routes"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"
import notFound from "./app/middlewares/notFound"
import cookieParser from "cookie-parser"
import passport from "passport"
import expressSession from "express-session"
import './app/config/passport'

const app = express()

app.use(cors({
    origin: [
        "https://frontend-tour-management-delta.vercel.app", 
        "http://localhost:3000",                             
    ],
    credentials: true,
}));
app.use(express.json())
app.use(cookieParser())


app.use(
    expressSession({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
    })
);
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", router)

app.get("/", async (req: Request, res: Response) => {
    res.status(200).json({
        message: "welcome to tour management system"
    })
})

app.use(globalErrorHandler)
app.use(notFound)



export default app;