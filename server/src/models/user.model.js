import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    }, email: {
        type: String,
        required: true,
        unique: true
    }, password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    usedStorage: {
        type: Number,
        default: 0
    },
    storageLimit: {
        type: Number,
        default: 1073741824 // 1 GB in bytes
    }
}, { timestamps: true });

userSchema.index({email : 1});

const User = model("Users",userSchema);
export default User;