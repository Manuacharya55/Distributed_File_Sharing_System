import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateData } from "../middlewares/validation.middleware.js";
import { folderSchema } from "../schema/folder.schema.js";
import {
    createFolder,
    getFolders,
    getSingleFolder,
    updateFolder,
    deleteFolder,
    getTrashItems,
    emptyTrash
} from "../controllers/folder.controller.js";

const router = express.Router();

router.use(verifyJWT);

// Trash endpoints (must be defined before /:id)
router.get("/trash", getTrashItems);
router.delete("/trash/empty", emptyTrash);

router.route("/")
    .post(validateData(folderSchema), createFolder)
    .get(getFolders);

router.route("/:id")
    .get(getSingleFolder)
    .patch(validateData(folderSchema), updateFolder)
    .delete(deleteFolder);

export default router;
