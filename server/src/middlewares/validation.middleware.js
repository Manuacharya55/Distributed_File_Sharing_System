import z, { success } from "zod"
import { ValidationError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const validateData = (schema) => asyncHandler((req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error.issues,"Please enter a valid data")
    }

    next()
})