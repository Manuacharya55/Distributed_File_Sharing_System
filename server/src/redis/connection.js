import { Redis } from "ioredis"
import dotenv from "dotenv"
dotenv.config()

const redisIO = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

redisIO.on("connected",()=>{
    console.log("connected to redis")
})
redisIO.on("error",(err)=>{
    console.log("Redis Error:", err.message)
})

export const connection = redisIO;

export default redisIO