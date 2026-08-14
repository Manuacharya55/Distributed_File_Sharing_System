import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.router.js"
import fileRouter from "./routes/file.router.js"
import { globalError } from "./utils/globalError.js";

const app = express();

app.use(express.json())
app.use((cookieParser()))
app.use(cors())

app.get("/health",(req,res)=>{
    res.send({
        success : true,
        message : "server is healthy"
    })
})

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/file",fileRouter)

app.use(globalError)

export default app;