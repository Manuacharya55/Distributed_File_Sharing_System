import z from "zod"

export const userRegisterSchema = z.object({
    name: z
        .string({ message: "name cannot be empty" })
        .min(2, "name must have at least 2 characters")
        .max(50, "name should have less than 50 characters"),
    email: z
        .email({ message: "enter a valid email" }),
    password: z
        .string({ message: "password cannot be empty" })
        .min(5, "password must have at least 5 characters")
        .max(25, "password should have less than 25 characters"),
})

export const userLoginSchema = z.object({
    email: z
        .email({ message: "enter a valid email" }),
    password: z
        .string({ message: "password cannot be empty" })
        .min(5, "password must have at least 5 characters")
        .max(25, "password should have less than 25 characters"),
})

export const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    email: z.string().email({ message: "enter a valid email" })
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required")
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"]
});