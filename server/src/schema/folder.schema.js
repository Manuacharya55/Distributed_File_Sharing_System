import z from "zod";

export const folderSchema = z.object({
    name: z
        .string({ message: "name cannot be empty" })
        .min(1, "name must have at least 1 character")
        .max(50, "name should have less than 50 characters")
});
