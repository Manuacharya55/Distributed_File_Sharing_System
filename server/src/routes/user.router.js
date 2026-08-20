import { Router } from "express";
import { getProfile, updateProfile, changePassword, updateAvatar } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateData } from "../middlewares/validation.middleware.js";
import { updateProfileSchema, changePasswordSchema } from "../schema/user.schema.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/profile", getProfile);
router.patch("/profile", validateData(updateProfileSchema), updateProfile);
router.patch("/password", validateData(changePasswordSchema), changePassword);
router.patch("/update-avatar", upload.single("avatar"), updateAvatar);

export default router;
