import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { globalError } from "./utils/globalError.js";
import authRouter from "./routes/auth.router.js";
import fileRouter from "./routes/file.router.js";
import folderRouter from "./routes/folder.router.js";
import dashboardRouter from "./routes/dashboard.router.js";
import userRouter from "./routes/user.router.js";
import shareRouter from "./routes/share.router.js";
import { NotFoundError } from "./utils/ApiError.js";

const app = express();

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: false, // allow loading preview resources
}));

// Request logging with Morgan
app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Auth rate limiter (e.g. 50 requests per 15 minutes)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many authentication requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.get("/health", (req, res) => {
    res.send({
        success: true,
        message: "server is healthy"
    });
});

app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/file", fileRouter);
app.use("/api/v1/folder", folderRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/share", shareRouter);

app.use((req, res, next) => {
    next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

app.use(globalError);

export default app;