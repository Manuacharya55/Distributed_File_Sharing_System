import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getPresignedUploadUrl,
    confirmUpload,
    getAllFiles,
    getSingleFile,
    deleteFile,
    restoreFile,
    permanentDeleteFile
} from "../controllers/file.controller.js";

const router = express.Router();

router.use(verifyJWT);

// Presigned Upload workflow
router.post("/presigned-url", getPresignedUploadUrl);
router.post("/confirm-upload", confirmUpload);

// File CRUD & lifecycle
router.route("/")
    .get(getAllFiles);

router.route("/:id")
    .get(getSingleFile)
    .delete(deleteFile);

router.patch("/:id/restore", restoreFile);
router.delete("/:id/permanent", permanentDeleteFile);

export default router;