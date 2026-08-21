import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleFileShare, getPublicSharedFile } from "../controllers/share.controller.js";

const router = express.Router();

// Public endpoint to access shared file
router.get("/access/:shareToken", getPublicSharedFile);

// Authenticated toggle endpoint
router.use(verifyJWT);
router.patch("/file/:id/toggle", toggleFileShare);

export default router;
