import { Router } from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateData } from "../middlewares/validation.middleware.js";
import { updateProfileSchema, changePasswordSchema } from "../schema/user.schema.js";

const router = Router();

router.use(verifyJWT);

router.get("/profile", getProfile);
router.patch("/profile", validateData(updateProfileSchema), updateProfile);
router.patch("/password", validateData(changePasswordSchema), changePassword);

export default router;
