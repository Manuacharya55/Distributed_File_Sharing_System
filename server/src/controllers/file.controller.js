import { ApiSuccess } from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const uploadFile = asyncHandler(async(req,res)=>{
    const file = req.files;
    console.log("file",file)
    res.status(201).json(new ApiSuccess(201,file,"file uploaded successfully"))
})