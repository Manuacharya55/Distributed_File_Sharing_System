import { z } from "zod";

export const registerSchema = z.object({
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
});

export const loginSchema = z.object({
  email: z
    .email({ message: "enter a valid email" }),
  password: z
    .string({ message: "password cannot be empty" })
    .min(5, "password must have at least 5 characters")
    .max(25, "password should have less than 25 characters"),
});

export const verifyotpSchema = z.object({
  otp: z
    .string({ message: "OTP cannot be empty" })
    .length(4, "OTP must be exactly 4 characters"),
});
