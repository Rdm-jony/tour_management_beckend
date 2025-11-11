import z from "zod";

export const sendOtpSchema = z.object({
    email: z.string().email().nonempty("required")
})
export const verfyOtpSchema = z.object({
    email: z.string().email().nonempty("required"),
    otp: z.string().nonempty("required")
})