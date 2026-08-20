import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

import { globalError } from "./utils/globalError.js";

import authRouter from "./routes/auth.router.js"
import fileRouter from "./routes/file.router.js"
import folderRouter from "./routes/folder.router.js"
import dashboardRouter from "./routes/dashboard.router.js"
import userRouter from "./routes/user.router.js"
import { NotFoundError } from "./utils/ApiError.js";

const app = express();

app.use(express.json())
app.use((cookieParser()))
app.use(cors({ origin: true, credentials: true }))

app.get("/health",(req,res)=>{
    res.send({
        success : true,
        message : "server is healthy"
    })
})



app.use("/api/v1/auth",authRouter)
app.use("/api/v1/file",fileRouter)
app.use("/api/v1/folder",folderRouter)
app.use("/api/v1/dashboard",dashboardRouter)
app.use("/api/v1/user",userRouter)


app.use((req, res, next) => {
    next(new NotFoundError(`Route ${req.originalUrl} not found`));
})

app.use(globalError)


export default app;