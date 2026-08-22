import crypto from "crypto";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError, BadRequestError } from "../utils/ApiError.js";
import File from "../models/file.model.js";
import { getPresignedGetUrl } from "../utils/s3.helper.js";

const DEFAULT_EXPIRY_SECONDS = 3600; // 1 hour for presigned access

//========================================================
// toggles share link like mega
//========================================================
export const toggleFileShare = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isShareable } = req.body;
    const userId = req.user._id;

    const file = await File.findOne({ _id: id, user: userId, isDeleted: false });
    if (!file) {
        throw new NotFoundError("File not found");
    }

    // If isShareable boolean is passed, set it; otherwise toggle current value
    file.isShareable = typeof isShareable === "boolean" ? isShareable : !file.isShareable;

    // Generate token if not already assigned
    if (file.isShareable && !file.shareToken) {
        file.shareToken = crypto.randomBytes(12).toString("hex");
    }

    await file.save();

    res.status(200).json(new ApiSuccess(200, {
        fileId: file._id,
        isShareable: file.isShareable,
        shareToken: file.shareToken,
        originalName: file.originalName,
    }, file.isShareable ? "Public link sharing enabled" : "Public link sharing disabled"));
});



//========================================================
// gets shared file with presigned url
//========================================================
export const getPublicSharedFile = asyncHandler(async (req, res) => {
    const { shareToken } = req.params;

    if (!shareToken) {
        throw new BadRequestError("Share token is required");
    }

    const file = await File.findOne({ shareToken, isDeleted: false });

    if (!file || !file.isShareable) {
        throw new NotFoundError("This link is private, invalid, or sharing has been disabled by the owner.");
    }

    // Generate dynamic 1-hour presigned preview and download URLs
    const previewUrl = await getPresignedGetUrl(file.key, file.originalName, false, DEFAULT_EXPIRY_SECONDS);
    const downloadUrl = await getPresignedGetUrl(file.key, file.originalName, true, DEFAULT_EXPIRY_SECONDS);

    res.status(200).json(new ApiSuccess(200, {
        file: {
            _id: file._id,
            originalName: file.originalName,
            mimeType: file.mimeType,
            size: file.size,
            extension: file.extension,
            previewUrl,
            downloadUrl,
            createdAt: file.createdAt
        }
    }, "Shared file fetched successfully"));
});
