import { Schema, model } from "mongoose";

const fileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    fileurl: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    mimetype: {
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
  },
  { timestamps: true }
);

const File = model("File", fileSchema);

export default File;
