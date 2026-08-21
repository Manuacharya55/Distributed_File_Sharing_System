import { Schema, model } from "mongoose";

const shareSchema = new Schema(
  {
    shareToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    resourceType: {
      type: String,
      enum: ["file", "folder"],
      required: true,
    },
    file: {
      type: Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },
    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    hasPassword: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

shareSchema.index({ owner: 1, createdAt: -1 });

const Share = model("Share", shareSchema);

export default Share;
