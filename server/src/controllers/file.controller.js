import { ApiSuccess } from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import File from "../models/file.model.js";
import { ApiError, NotFoundError, UnauthorizedError } from "../utils/ApiError.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { awsS3Bucket } from "../utils/aws.js";
import path from 'path';
import { paginate } from "../utils/pagination.js";

const awsUpload = async(files,userId)=>{
    try {
        //const uploadedFiles = []
        const uploadBulkImgaes = files.map(async(file) => {
            const uniqueName = `${Date.now()}-${userId}-${file.originalname}`;
            const s3Key = `/uploads/${uniqueName}`;

            const command = new PutObjectCommand({
                Bucket : process.env.AWS_BUCKET_NAME,
                Key : s3Key,
                Body : file.buffer,
                ContentType : file.mimetype,
            });

            await awsS3Bucket.send(command)
            return {
                name : file.originalname,
                mimetype : file.mimetype,
                extension : path.extname(file.originalname).toLowerCase().replace('.', ''),
                fileSize : file.size,
                s3_key : s3Key,
                aws_url : `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`
            }
        })

        const uploadedFiles = await Promise.all(uploadBulkImgaes)
        return uploadedFiles


    } catch (error) {
        console.log(error)
        throw new ApiError(400,error.message,"something went wrong")
    }
}
export const uploadFile = asyncHandler(async(req,res)=>{
    const files = req.files;
    const {folder} = req.body;
    const {_id} = req.user;

    if(!files){
        throw new ApiError(400,"No files uploaded")
    }
    const uploadedFiles = await awsUpload(files,req.user._id)

    const allFiles = uploadedFiles.map(file => ({
        user : _id,
        folder : folder || null,
        fileUrl : file.aws_url,
        extension : file.extension,
        mimeType : file.mimetype,
        size : file.fileSize,
        key : file.s3_key,
        originalName : file.name
    }))

    const successfulFiles = await File.create(allFiles);
    res.status(201).json(new ApiSuccess(201,successfulFiles,"file uploaded successfully"))
})

export const getSingleFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
        throw new NotFoundError("File not found");
    }

    if (file.user.toString() !== req.user._id.toString()) {
        throw new UnauthorizedError("You do not have permission to view this file");
    }

    res.status(200).json(new ApiSuccess(200, file, "File retrieved successfully"));
});

export const getAllFiles = asyncHandler(async (req, res) => {
    const query = { user: req.user._id };
    const { results, pagination } = await paginate(File, query, req.query.page, req.query.limit);
    res.status(200).json(new ApiSuccess(200, { files: results, pagination }, "Files retrieved successfully"));
});

export const deleteFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
        throw new NotFoundError("File not found");
    }

    if (file.user.toString() !== req.user._id.toString()) {
        throw new UnauthorizedError("You do not have permission to delete this file");
    }

    // Physical deletion (e.g. S3) will go here later
    await File.findByIdAndDelete(id);

    res.status(200).json(new ApiSuccess(200, null, "File deleted successfully"));
});