import { ApiSuccess } from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Folder from "../models/folder.model.js";
import File from "../models/file.model.js";
import { NotFoundError, UnauthorizedError, DuplicateError } from "../utils/ApiError.js";
import { paginate } from "../utils/pagination.js";

export const createFolder = asyncHandler(async (req, res) => {
    const { name } = req.body;
    
    const existingFolder = await Folder.findOne({ name, user: req.user._id});
    if (existingFolder) {
        throw new DuplicateError([{ name: "folder", message: "Folder with this name already exists here" }], "Folder exists");
    }

    const folder = await Folder.create({
        name,
        user: req.user._id
    });

    res.status(201).json(new ApiSuccess(201, folder, "Folder created successfully"));
});

export const getFolders = asyncHandler(async (req, res) => {
    const query = { user: req.user._id };
    
    const { results, pagination } = await paginate(Folder, query, req.query.page, req.query.limit);
    
    res.status(200).json(new ApiSuccess(200, { folders: results, pagination }, "Folders retrieved successfully"));
});

export const getSingleFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {_id}=req.user;

    const folder = await Folder.findOne({_id : id , user : _id});

    if (!folder) {
        throw new NotFoundError("Folder not found");
    }

    const { results, pagination } = await paginate(File, {folder : id , user : _id}, req.query.page, req.query.limit);

    res.status(200).json(new ApiSuccess(200, { folder, files: results, pagination }, "Folder retrieved successfully"));
});

export const updateFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const {_id}=req.user;

    const folder = await Folder.findOne({_id : id , user : _id});

    if (!folder) {
        throw new NotFoundError("Folder not found");
    }

    if (folder.user.toString() !== req.user._id.toString()) {
        throw new UnauthorizedError("You do not have permission to edit this folder");
    }

    folder.name = name || folder.name;
    await folder.save();

    res.status(200).json(new ApiSuccess(200, folder, "Folder updated successfully"));
});

