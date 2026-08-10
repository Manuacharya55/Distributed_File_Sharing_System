import z from "zod"

export const userRegisterSchema = z.object({
    name: z
        .string({
            invalid_type_error: "enter a valid name",
            required_error: "name cannot be empty"
        })
        .min("2", "name must have alteast 2 characters")
        .max(50, "name should have less than 50 characters"),
    email: z
        .email({
            invalid_type_error: "enter a valid email",
            required_error: "enter a valid email"
        }),
    password: z
        .string({
            invalid_type_error: "enter a valid password",
            required_error: "password cannot be empty"
        })
        .min(5, "passsword must have alteast 5 characters")
        .max(25, "passsword should have less than 25 characters"),
})

export const userLoginSchema = z.object({
    email: z
        .email({
            invalid_type_error: "enter a valid email",
            required_error: "enter a valid email"
        }),
    password: z
        .string({
            invalid_type_error: "enter a valid password",
            required_error: "password cannot be empty"
        })
        .min(5, "passsword must have alteast 5 characters")
        .max(25, "passsword should have less than 25 characters"),
})