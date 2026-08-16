import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        require: true,
    }, email: {
        type: String,
        require: true,
        unique: true
    }, password: {
        type: String,
        require: true,
    },
    refreshToken: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.index({email : 1});

const User = model("Users",userSchema);
export default User;