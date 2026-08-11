import User from "../models/user.model.js";
import { DuplicateError, NotFoundError, UnauthorizedError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { compareHashedPassword, hashPassword } from "../utils/argon.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { createToken } from "../utils/JWT.js";

const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
}

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new DuplicateError([{ name: "email", message: "email already exists" }], "email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({ name, email, password: hashedPassword });

    const { accessToken, refreshToken } = await createToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const data = {
        _id: user._id,
        email: user.email,
        token: accessToken
    }

    res.cookie("refresh-token", refreshToken, options).status(201).json(new ApiSuccess(201, data, "User registered successfully"))
})

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        throw new UnauthorizedError("invalid credentials")
    }

    const isValidPassword = await compareHashedPassword(existingUser.password, password);

    if (!isValidPassword) {
        throw new UnauthorizedError("invalid credentials")
    }

    const { accessToken, refreshToken } = await createToken(existingUser);

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    const data = {
        _id: existingUser._id,
        email: existingUser.email,
        token: accessToken
    }

    res.cookie("token", refreshToken, options).status(201).json(new ApiSuccess(201, data, "User registered successfully"))

})

export const logoutUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const existingUser = await User.findById(_id).select("-password -otp");

    existingUser.refreshToken = null
    await existingUser.save();

    res.clearCookie('token')
    res.status(201).json(new ApiSuccess(201, null, "user logged out successfully"))
})