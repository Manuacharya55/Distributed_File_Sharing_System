import jwt from "jsonwebtoken"
import { asyncHandler } from "./asyncHandler.js"

export const createToken = async (data) => {
    try {
        const accessToken = await jwt.sign({
            _id: data._id
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' })

        const refreshToken = await jwt.sign({
            _id: data._id,
            email: data.email
        },process.env.REFRESH_TOKEN_SECRET,{expiresIn : '5d'})

        return {accessToken , refreshToken}
    } catch (error) {
        console.log(error)
    }
}