import { UnauthorizedError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authMiddleware = asyncHandler(async(req,res,next)=>{
    const token = req.headers.authorization.split(" ")[0];

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    if(!decoded) throw new UnauthorizedError()
    
    req.user = decoded;

    next();
})