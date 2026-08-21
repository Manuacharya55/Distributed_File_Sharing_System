import { Queue } from "bullmq";
import { connection } from "./connection.js";

export const folderCleanupQueue = new Queue("folder-cleanup-queue", { connection });
