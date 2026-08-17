import { ApiSuccess } from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import File from "../models/file.model.js";
import Folder from "../models/folder.model.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [totalFiles, totalFolders, totalImages, totalDocuments] = await Promise.all([
        File.countDocuments({ user: userId }),
        Folder.countDocuments({ user: userId }),
        File.countDocuments({ user: userId, mimeType: { $regex: /^image\// } }),
        File.countDocuments({ user: userId, mimeType: { $not: { $regex: /^image\// } } })
    ]);

    const recentFiles = await File.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('originalName mimeType createdAt size')
        .lean();

    const recentFolders = await Folder.find({ user: userId })
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
        totalDocuments
    };

    res.status(200).json(new ApiSuccess(200, { stats, recentActivity }, "Dashboard stats retrieved successfully"));
});
