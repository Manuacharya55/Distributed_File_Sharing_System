import { Schema, model } from "mongoose";

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    }
  },
  { timestamps: true }
);

folderSchema.index({ user: 1, isDeleted: 1, createdAt: -1 });

const Folder = model("Folder", folderSchema);

export default Folder;
