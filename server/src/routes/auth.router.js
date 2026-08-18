import express from "express"
import { validateData } from "../middlewares/validation.middleware.js";
import { userLoginSchema, userRegisterSchema } from "../schema/user.schema.js";
import { loginUser, logoutUser, registerUser, verifyEmail, refreshAccessToken } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register",validateData(userRegisterSchema),registerUser)
router.post("/login",validateData(userLoginSchema),loginUser)
router.post("/logout",verifyJWT,logoutUser)
router.post("/verify-email",verifyJWT,verifyEmail)
router.get("/refresh-token", refreshAccessToken)

export default router