import { Worker } from "bullmq";
import { connection } from "./connection.js";
import { sendMail } from "../services/email.service.js";

const worker = new Worker("email-queue", async (job) => {
  const { email, subject, htmlTemplate } = job.data;
  return await sendMail(email, subject, htmlTemplate);
}, { connection });

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error: ${err}`);
});