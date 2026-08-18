import { UnauthorizedError, TokenExpiredError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        if(!decoded) throw new UnauthorizedError("Invalid token")
        
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError' || error instanceof TokenExpiredError) {
            throw new TokenExpiredError("Token Expired");
        }
        throw new UnauthorizedError("Invalid token");
    }
})