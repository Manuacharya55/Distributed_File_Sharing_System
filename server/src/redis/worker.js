import { Worker } from "bullmq";
import { connection } from "./connection.js";
import { sendMail } from "../services/email.service.js";
import "./folderCleanup.worker.js";
import { logger } from "../utils/logger.js";

const worker = new Worker("email-queue", async (job) => {
  const { email, subject, htmlTemplate } = job.data;
  return await sendMail(email, subject, htmlTemplate);
}, { connection });

worker.on("completed", (job) => {
  logger.info(`[EmailWorker] Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  logger.error(`[EmailWorker] Job ${job.id} failed`, err);
});