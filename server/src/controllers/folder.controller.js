import { ApiSuccess } from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Folder from "../models/folder.model.js";
import File from "../models/file.model.js";
import { NotFoundError, UnauthorizedError, DuplicateError, BadRequestError } from "../utils/ApiError.js";
import { paginate } from "../utils/pagination.js";
import { folderCleanupQueue } from "../redis/folderCleanup.queue.js";
import { getPresignedGetUrl } from "../utils/s3.helper.js";

const DEFAULT_EXPIRY_SECONDS = 3600;

export const createFolder = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;

    const existingFolder = await Folder.findOne({
        name,
        user: userId,
        isDeleted: false
    });

    if (existingFolder) {
        throw new DuplicateError([{ name: "folder", message: "Folder with this name already exists" }], "Folder exists");
    }

    const folder = await Folder.create({
        name,
        user: userId,
        isDeleted: false
    });

    res.status(201).json(new ApiSuccess(201, folder, "Folder created successfully"));
});

export const getFolders = asyncHandler(async (req, res) => {
    const query = { user: req.user._id, isDeleted: false };
    
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
    }
    
    const { results, pagination } = await paginate(Folder, query, req.query.page, req.query.limit);
    
    res.status(200).json(new ApiSuccess(200, { folders: results, pagination }, "Folders retrieved successfully"));
});

export const getSingleFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const folder = await Folder.findOne({ _id: id, user: userId, isDeleted: false });

    if (!folder) {
        throw new NotFoundError("Folder not found");
    }

    // Get files in this folder
    const fileQuery = { folder: id, user: userId, isDeleted: false };
    if (req.query.search) {
        fileQuery.originalName = { $regex: req.query.search, $options: 'i' };
    }

    const { results, pagination } = await paginate(File, fileQuery, req.query.page, req.query.limit);

    // Attach signed URLs for private files
    const filesWithUrls = await Promise.all(
        results.map(async (file) => {
            const previewUrl = await getPresignedGetUrl(file.key, file.originalName, false, DEFAULT_EXPIRY_SECONDS);
            const downloadUrl = await getPresignedGetUrl(file.key, file.originalName, true, DEFAULT_EXPIRY_SECONDS);
            const obj = file.toObject ? file.toObject() : file;
            obj.previewUrl = previewUrl;
            obj.downloadUrl = downloadUrl;
            return obj;
        })
    );

    res.status(200).json(new ApiSuccess(200, {
        folder,
        files: filesWithUrls,
        pagination
    }, "Folder retrieved successfully"));
});

export const updateFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    const folder = await Folder.findOne({ _id: id, user: userId, isDeleted: false });

    if (!folder) {
        throw new NotFoundError("Folder not found");
    }

    if (name && name !== folder.name) {
        const existing = await Folder.findOne({
            name,
            user: userId,
            isDeleted: false,
            _id: { $ne: id }
        });
        if (existing) {
            throw new DuplicateError([{ name: "folder", message: "Folder with this name already exists" }], "Folder exists");
        }
        folder.name = name;
        await folder.save();
    }

    res.status(200).json(new ApiSuccess(200, folder, "Folder updated successfully"));
});

/**
 * Delete folder: marks soft-deleted and triggers background cascade cleanup via BullMQ
 */
export const deleteFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const folder = await Folder.findOne({ _id: id, user: userId });

    if (!folder) {
        throw new NotFoundError("Folder not found");
    }

    // Mark root folder as deleted immediately
    folder.isDeleted = true;
    folder.deletedAt = new Date();
    await folder.save();

    // Enqueue background cascade deletion worker job
    await folderCleanupQueue.add("cleanup-folder", {
        folderId: id,
        userId: userId.toString()
    });

    res.status(200).json(new ApiSuccess(200, null, "Folder deletion queued in background"));
});

/**
 * Get all Trash items (both soft-deleted files and folders)
 */
export const getTrashItems = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [folders, files] = await Promise.all([
        Folder.find({ user: userId, isDeleted: true }).sort({ deletedAt: -1 }).lean(),
        File.find({ user: userId, isDeleted: true }).sort({ deletedAt: -1 }).lean()
    ]);

    res.status(200).json(new ApiSuccess(200, { folders, files }, "Trash items retrieved successfully"));
});

/**
 * Empty all items from Trash
 */
export const emptyTrash = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const trashFolders = await Folder.find({ user: userId, isDeleted: true }).select("_id").lean();
    for (const folder of trashFolders) {
        await folderCleanupQueue.add("cleanup-folder", {
            folderId: folder._id.toString(),
            userId: userId.toString()
        });
    }

    const trashFiles = await File.find({ user: userId, isDeleted: true }).lean();
    for (const file of trashFiles) {
        if (file.key) {
            try {
                const { deleteS3Object } = await import("../utils/s3.helper.js");
                await deleteS3Object(file.key);
            } catch (err) {
                console.error("Failed to delete trash file S3 object:", err);
            }
        }
    }

    await File.deleteMany({ user: userId, isDeleted: true });

    res.status(200).json(new ApiSuccess(200, null, "Trash emptied successfully"));
});
