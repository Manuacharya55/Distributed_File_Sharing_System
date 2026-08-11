import { UnauthorizedError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

    if(!decoded) throw new UnauthorizedError()
    
    req.user = decoded;

    next();
})