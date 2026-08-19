import jwt from "jsonwebtoken"
import crypto from "crypto"

export const createToken = async (data, existingFamilyId = null) => {
    try {
        const accessToken = await jwt.sign({
            _id: data._id
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' })

        const jti = crypto.randomUUID();
        const familyId = existingFamilyId || crypto.randomUUID();

        const refreshToken = await jwt.sign({
            _id: data._id,
            email: data.email,
            jti,
            familyId
        },process.env.REFRESH_TOKEN_SECRET,{expiresIn : '5d'})

        return {accessToken , refreshToken, jti, familyId}
    } catch (error) {
        console.log(error)
    }
}