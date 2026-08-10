import z, { success } from "zod"

export const validateData = (data) => {
    const result = z.safeParse(data);

    return {
        success : result.success,
        data : result.data || null,
        errors : result.error.issues || null
    }
}