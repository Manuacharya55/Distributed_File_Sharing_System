import User from "../models/user.model.js";
import { ApiError, DuplicateError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { compareHashedPassword, hashPassword } from "../utils/argon.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { awsS3Bucket } from "../config/aws.js";
import path from 'path';

export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiSuccess(200, { user }, "User profile fetched successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const user = await User.findById(
        req.user._id
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) throw new DuplicateError([{ email: "email already exsits" }], "Email already used");

    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json(new ApiSuccess(200, { user }, "Profile updated successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }


    const isMatch = await compareHashedPassword(user.password, currentPassword);
    if (!isMatch) {
        throw new ApiError(401, "Invalid current password");
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json(new ApiSuccess(200, {}, "Password changed successfully"));
});

export const updateAvatar = asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
        throw new ApiError(400, "No avatar file provided");
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const uniqueName = `avatar-${Date.now()}-${user._id}-${file.originalname}`;
    const s3Key = `avatars/${uniqueName}`;

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await awsS3Bucket.send(command);

        const avatarUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        
        user.avatar = avatarUrl;
        await user.save();

        res.status(200).json(new ApiSuccess(200, { user }, "Avatar updated successfully"));
    } catch (error) {
        console.error("Failed to upload avatar to S3:", error);
        throw new ApiError(500, "Failed to upload avatar");
    }
});
