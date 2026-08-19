import { z } from "zod";

export const folderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(50, "Folder name must be less than 50 characters")
});
