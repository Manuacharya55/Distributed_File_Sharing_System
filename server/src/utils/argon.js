import argon from "argon2";

export const hashPassword = async(password)=>{
    try {
        const hashedPassword = await argon.hash(password)
        return hashedPassword
    } catch (error) {
        console.log(error)
    }
}

export const compareHashedPassword = async(hashedPassword,userPassword) => {
    const isValidPassword = await argon.verify(hashedPassword,userPassword)
    return isValidPassword;
}