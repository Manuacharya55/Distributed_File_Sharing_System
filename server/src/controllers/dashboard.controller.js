import { ApiSuccess } from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import File from "../models/file.model.js";
import Folder from "../models/folder.model.js";
import User from "../models/user.model.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [totalFiles, totalFolders, totalImages, totalDocuments, user] = await Promise.all([
        File.countDocuments({ user: userId, isDeleted: false }),
        Folder.countDocuments({ user: userId, isDeleted: false }),
        File.countDocuments({ user: userId, isDeleted: false, mimeType: { $regex: /^image\// } }),
        File.countDocuments({ user: userId, isDeleted: false, mimeType: { $not: { $regex: /^image\// } } }),
        User.findById(userId).select("usedStorage storageLimit").lean()
    ]);

    const recentFiles = await File.find({ user: userId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('originalName mimeType createdAt size')
        .lean();

    const recentFolders = await Folder.find({ user: userId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name createdAt')
        .lean();

    const formattedFiles = recentFiles.map(file => ({
        id: file._id,
        action: 'Uploaded',
        item: file.originalName || 'Unknown File',
        time: file.createdAt,
        type: file.mimeType.startsWith('image/') ? 'image' : 'file',
        timestamp: new Date(file.createdAt).getTime()
    }));

    const formattedFolders = recentFolders.map(folder => ({
        id: folder._id,
        action: 'Created Folder',
        item: folder.name,
        time: folder.createdAt,
        type: 'folder',
        timestamp: new Date(folder.createdAt).getTime()
    }));

    const recentActivity = [...formattedFiles, ...formattedFolders]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5)
        .map(({ timestamp, ...rest }) => rest);

    const stats = {
        totalFiles,
        totalFolders,
        totalImages,
        totalDocuments,
        usedStorage: user?.usedStorage || 0,
        storageLimit: user?.storageLimit || 1073741824 // 1GB
    };

    res.status(200).json(new ApiSuccess(200, { stats, recentActivity }, "Dashboard stats retrieved successfully"));
});
