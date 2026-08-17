import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/")
    .get(getDashboardStats);

export default router;
