import express from "express"
import upload from "../utils/multer.js";
import { uploadFile } from "../controllers/file.controller.js";

const router = express.Router();

router.route("/").post(upload.array('file'), uploadFile);

export default router;