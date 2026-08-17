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
    }
  },
  { timestamps: true }
);

const Folder = model("Folder", folderSchema);

export default Folder;
