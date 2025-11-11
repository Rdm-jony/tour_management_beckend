import z from "zod";
const strongPassword = z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    })
    .nonempty({ message: "Password is required." });
export const changePasswordShema = z.object({
    oldPassword: z.string().nonempty("required"),
    newPassword: strongPassword
})

export const setPasswordShema = z.object({
    plainPassword: strongPassword
})

export const loginShema = z.object({
    email: z.string().email().nonempty("required"),
    password: z.string().nonempty("required")
})

export const resetPasswordSchema = z.object({
    newPassword: strongPassword,
    id: z.string().nonempty("required")
})

export const forgetPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address format." })
})