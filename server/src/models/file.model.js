import { Schema, model } from "mongoose";

const fileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    originalName : {
      type: String,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    },
    isShareable: {
      type: Boolean,
      default: false
    },
    shareToken: {
      type: String,
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

fileSchema.index({ user: 1, folder: 1, isDeleted: 1 });
fileSchema.index({ user: 1, isDeleted: 1, createdAt: -1 });
fileSchema.index({ isDeleted: 1, deletedAt: 1 });

const File = model("File", fileSchema);

export default File;
