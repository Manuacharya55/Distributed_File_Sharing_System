import path from "path";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import File from "../models/file.model.js";
import User from "../models/user.model.js";
import Folder from "../models/folder.model.js";
import Share from "../models/share.model.js";
import { BadRequestError, NotFoundError, UnauthorizedError, InternalServerError } from "../utils/ApiError.js";
import { paginate } from "../utils/pagination.js";
import { getPresignedUploadUrl as s3GetPresignedUploadUrl, getPresignedGetUrl, deleteS3Object } from "../utils/s3.helper.js";

const DEFAULT_EXPIRY_SECONDS = 3600; // 1 hour for download/preview URLs

//========================================================
// creates a magic link that can be used to upload files directly to S3
//========================================================
export const getPresignedUploadUrl = asyncHandler(async (req, res) => {
    const { filename, mimeType, size, folder } = req.body;
    const userId = req.user._id;

    if (!filename || !mimeType || typeof size !== "number" || size <= 0) {
        throw new BadRequestError("Filename, mimeType, and positive size are required");
    }

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const currentUsed = user.usedStorage || 0;
    const limit = user.storageLimit || 1073741824; // 1GB

    if (currentUsed + size > limit) {
        const remainingMB = Math.max(0, ((limit - currentUsed) / (1024 * 1024)).toFixed(2));
        throw new BadRequestError(
            `Storage quota exceeded. You have ${remainingMB} MB remaining out of 1 GB. File size is ${(size / (1024 * 1024)).toFixed(2)} MB.`
        );
    }

    if (folder) {
        const folderDoc = await Folder.findOne({ _id: folder, user: userId, isDeleted: false });
        if (!folderDoc) {
            throw new NotFoundError("Destination folder not found");
        }
    }

    const sanitizedName = path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueKey = `uploads/${userId}/${Date.now()}-${sanitizedName}`;

    // Generate 15-minute presigned PUT URL
    const { url, key } = await s3GetPresignedUploadUrl(uniqueKey, mimeType, 15 * 60);

    res.status(200).json(new ApiSuccess(200, {
        presignedUrl: url,
        key,
        filename,
        mimeType,
        size,
        folder: folder || null
    }, "Presigned upload URL generated successfully"));
});



//========================================================
// confirms the upload and saves the file to the database
//========================================================
export const confirmUpload = asyncHandler(async (req, res) => {
    const { key, originalName, mimeType, size, folder } = req.body;
    const userId = req.user._id;

    if (!key || !originalName || !mimeType || !size) {
        throw new BadRequestError("key, originalName, mimeType, and size are required");
    }

    // Verify folder if provided
    if (folder) {
        const folderDoc = await Folder.findOne({ _id: folder, user: userId, isDeleted: false });
        if (!folderDoc) throw new NotFoundError("Target folder not found");
    }

    const extension = path.extname(originalName).toLowerCase().replace(".", "");
    const staticUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const newFile = await File.create({
        user: userId,
        folder: folder || null,
        fileUrl: staticUrl,
        extension: extension || "bin",
        mimeType,
        size,
        key,
        originalName,
        isDeleted: false
    });

    // Atomically increment user storage
    await User.findByIdAndUpdate(userId, { $inc: { usedStorage: size } });

    // Generate preview & download URLs
    const previewUrl = await getPresignedGetUrl(key, originalName, false, DEFAULT_EXPIRY_SECONDS);
    
    const downloadUrl = await getPresignedGetUrl(key, originalName, true, DEFAULT_EXPIRY_SECONDS);

    const fileResponse = newFile.toObject();
    fileResponse.previewUrl = previewUrl;
    fileResponse.downloadUrl = downloadUrl;

    res.status(201).json(new ApiSuccess(201, fileResponse, "File uploaded and confirmed successfully"));
});



//========================================================
// gets a single file with dynamic presigned URLs
//========================================================
export const getSingleFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const file = await File.findOne({ _id: id, isDeleted: false });

    if (!file) {
        throw new NotFoundError("File not found");
    }

    if (file.user.toString() !== req.user._id.toString()) {
        throw new UnauthorizedError("You do not have permission to view this file");
    }

    const previewUrl = await getPresignedGetUrl(file.key, file.originalName, false, DEFAULT_EXPIRY_SECONDS);
    const downloadUrl = await getPresignedGetUrl(file.key, file.originalName, true, DEFAULT_EXPIRY_SECONDS);

    const result = file.toObject();
    result.previewUrl = previewUrl;
    result.downloadUrl = downloadUrl;

    res.status(200).json(new ApiSuccess(200, result, "File retrieved successfully"));
});



//========================================================
// gets all active files for user (with optional search and folder filter)
//========================================================
export const getAllFiles = asyncHandler(async (req, res) => {
    const query = { user: req.user._id, isDeleted: false };
    
    if (req.query.search) {
        query.originalName = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.folder !== undefined) {
        query.folder = req.query.folder === "null" || req.query.folder === "" ? null : req.query.folder;
    }

    const { results, pagination } = await paginate(File, query, req.query.page, req.query.limit);

    // Attach signed URLs to results for private access
    const filesWithSignedUrls = await Promise.all(
        results.map(async (file) => {
            const previewUrl = await getPresignedGetUrl(file.key, file.originalName, false, DEFAULT_EXPIRY_SECONDS);
            const downloadUrl = await getPresignedGetUrl(file.key, file.originalName, true, DEFAULT_EXPIRY_SECONDS);
            const obj = file.toObject ? file.toObject() : file;
            obj.previewUrl = previewUrl;
            obj.downloadUrl = downloadUrl;
            return obj;
        })
    );

    res.status(200).json(new ApiSuccess(200, { files: filesWithSignedUrls, pagination }, "Files retrieved successfully"));
});




//========================================================
// soft delete file (move to trash)
//========================================================
export const deleteFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const file = await File.findOne({ _id: id, user: req.user._id });

    if (!file) {
        throw new NotFoundError("File not found");
    }

    file.isDeleted = true;
    file.deletedAt = new Date();
    await file.save();

    res.status(200).json(new ApiSuccess(200, null, "File moved to trash successfully"));
});



//========================================================
// restores soft-deleted file from trash
//========================================================
export const restoreFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const file = await File.findOne({ _id: id, user: req.user._id, isDeleted: true });

    if (!file) {
        throw new NotFoundError("File not found in trash");
    }

    file.isDeleted = false;
    file.deletedAt = null;
    await file.save();

    res.status(200).json(new ApiSuccess(200, file, "File restored successfully"));
});



//========================================================
// permanently delete file from trash
//========================================================
export const permanentDeleteFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const file = await File.findOne({ _id: id, user: req.user._id });

    if (!file) {
        throw new NotFoundError("File not found");
    }

    // Delete from S3
    if (file.key) {
        try {
            await deleteS3Object(file.key);
        } catch (error) {
            console.error("Failed to delete S3 object:", error);
        }
    }

    // Deduct from usedStorage
    const user = await User.findById(req.user._id);
    if (user && file.size) {
        user.usedStorage = Math.max(0, (user.usedStorage || 0) - file.size);
        await user.save();
    }

    // Delete DB record & shares
    await File.findByIdAndDelete(id);
    await Share.deleteMany({ file: id });

    res.status(200).json(new ApiSuccess(200, null, "File permanently deleted"));
});