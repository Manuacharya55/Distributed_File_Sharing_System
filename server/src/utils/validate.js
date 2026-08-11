import z from "zod"

export const validateData = (schema, data) => {
    const result = schema.safeParse(data);

    return {
        success : result.success,
        data : result.data || null,
        errors : result.error ? result.error.issues : null
    }
}