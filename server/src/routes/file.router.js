import express from "express"
import upload from "../middlewares/multer.middleware.js";
import { uploadFile, getSingleFile, getAllFiles, deleteFile } from "../controllers/file.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/")
    .post(upload.array('files', 10), uploadFile)
    .get(getAllFiles);

router.route("/:id")
    .get(getSingleFile)
    .delete(deleteFile);

export default router;