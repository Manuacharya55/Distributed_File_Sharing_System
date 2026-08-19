import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import redisIO from "../redis/connection.js";
import crypto from "crypto";
import { DuplicateError, NotFoundError, UnauthorizedError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { compareHashedPassword, hashPassword } from "../utils/argon.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { createToken } from "../utils/JWT.js";
import { emailQueue } from "../redis/queue.js";
import { generateOTPTemplate } from "../templates/otp.template.js";

const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
}

const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
}

const setOtpToRedis = async (userId, otp) => {
    await redisIO.set(`otp:${userId}`, otp, 'EX', 900)
}

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new DuplicateError([{ name: "email", message: "email already exists" }], "email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({ name, email, password: hashedPassword });

    const { accessToken, refreshToken, jti, familyId } = await createToken(user);

    await redisIO.set(`refresh_token:${user._id.toString()}:${familyId}`, jti, 'EX', 5 * 24 * 60 * 60);

    const data = {
        _id: user._id,
        email: user.email,
        token: accessToken
    }

    const otp = generateOtp();
    const htmlTemplate = generateOTPTemplate(otp);

    await setOtpToRedis(user._id.toString(), otp);
    const job = await emailQueue.add("send-otp-email", {
        email: user.email,
        subject: "Your OTP Verification Code",
        htmlTemplate
    }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
    res.cookie("refreshToken", refreshToken, options).status(201).json(new ApiSuccess(201, data, "User registered successfully"))
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

    if (!existingUser.isVerified) {
        throw new UnauthorizedError("Email not verified. Please verify your email before logging in.");
    }

    const { accessToken, refreshToken, jti, familyId } = await createToken(existingUser);

    await redisIO.set(`refresh_token:${existingUser._id.toString()}:${familyId}`, jti, 'EX', 5 * 24 * 60 * 60);

    const data = {
        _id: existingUser._id,
        email: existingUser.email,
        token: accessToken
    }

    res.cookie("refreshToken", refreshToken, options).status(201).json(new ApiSuccess(201, data, "User logged in successfully"))

})

export const logoutUser = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (incomingRefreshToken) {
        try {
            const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redisIO.del(`refresh_token:${decodedToken._id}:${decodedToken.familyId}`);
        } catch (error) {
            console.error("Invalid token on logout");
        }
    }

    res.clearCookie('refreshToken')
    res.status(201).json(new ApiSuccess(201, null, "user logged out successfully"))
})

export const verifyEmail = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const userId = req.user._id.toString();

    const cachedOtp = await redisIO.get(`otp:${userId}`);

    if (!cachedOtp || cachedOtp !== otp) {
        throw new UnauthorizedError("Invalid OTP");
    }

    const user = await User.findById(userId);
    
    if (!user) {
        throw new NotFoundError("User not found");
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json(new ApiSuccess(200, null, "Email verified successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
        throw new UnauthorizedError("Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new UnauthorizedError("Invalid refresh token");
        }

        const redisJti = await redisIO.get(`refresh_token:${decodedToken._id}:${decodedToken.familyId}`);

        if (redisJti !== decodedToken.jti) {
            if (redisJti) {
                // Reuse detected - invalidate the family
                await redisIO.del(`refresh_token:${decodedToken._id}:${decodedToken.familyId}`);
            }
            throw new UnauthorizedError("Refresh token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken, jti: newJti, familyId } = await createToken(user, decodedToken.familyId);
        
        await redisIO.set(`refresh_token:${user._id.toString()}:${familyId}`, newJti, 'EX', 5 * 24 * 60 * 60);
        
        res.cookie("refreshToken", newRefreshToken, options).status(200).json(
            new ApiSuccess(200, { token: accessToken }, "Access token refreshed")
        );
    } catch (error) {
        throw new UnauthorizedError("Invalid refresh token");
    }
});