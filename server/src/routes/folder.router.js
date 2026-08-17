import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createFolder, getFolders, getSingleFolder, updateFolder } from "../controllers/folder.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/")
    .post(createFolder)
    .get(getFolders);

router.route("/:id")
    .get(getSingleFolder)
    .patch(updateFolder)
    // .delete(deleteFolder);

export default router;
