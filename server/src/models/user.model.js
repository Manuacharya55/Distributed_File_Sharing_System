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
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.index({email : 1});

const User = model("Users",userSchema);
export default User;