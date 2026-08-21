import { Worker } from "bullmq";
import { connection } from "./connection.js";
import Folder from "../models/folder.model.js";
import File from "../models/file.model.js";
import User from "../models/user.model.js";
import { deleteS3ObjectsBatch } from "../utils/s3.helper.js";

export const folderCleanupWorker = new Worker(
    "folder-cleanup-queue",
    async (job) => {
        const { folderId, userId } = job.data;
        console.log(`[FolderCleanupWorker] Processing cleanup for folder ${folderId} of user ${userId}`);

        try {
            // 1. Find all files located inside this folder
            const files = await File.find({
                folder: folderId,
                user: userId,
            }).select("_id key size").lean();

            const s3Keys = files.map(f => f.key).filter(Boolean);
            const fileIds = files.map(f => f._id);
            const totalFreedBytes = files.reduce((acc, curr) => acc + (curr.size || 0), 0);

            // 2. Delete physical S3 objects in batch
            if (s3Keys.length > 0) {
                await deleteS3ObjectsBatch(s3Keys);
            }

            // 3. Delete File documents from MongoDB
            if (fileIds.length > 0) {
                await File.deleteMany({ _id: { $in: fileIds } });
            }

            // 4. Delete the Folder document from MongoDB
            await Folder.deleteOne({ _id: folderId, user: userId });

            // 5. Decrement user's usedStorage
            if (totalFreedBytes > 0) {
                const user = await User.findById(userId);
                if (user) {
                    user.usedStorage = Math.max(0, (user.usedStorage || 0) - totalFreedBytes);
                    await user.save();
                }
            }

            console.log(`[FolderCleanupWorker] Successfully cleaned up folder ${folderId}, deleted ${files.length} files (${totalFreedBytes} bytes freed)`);
            return { folderId, cleanedFiles: files.length, totalFreedBytes };
        } catch (error) {
            console.error(`[FolderCleanupWorker] Error cleaning up folder ${folderId}:`, error);
            throw error;
        }
    },
    { connection }
);

folderCleanupWorker.on("completed", (job) => {
    console.log(`Folder cleanup job ${job.id} completed`);
});

folderCleanupWorker.on("failed", (job, err) => {
    console.error(`Folder cleanup job ${job.id} failed:`, err);
});

