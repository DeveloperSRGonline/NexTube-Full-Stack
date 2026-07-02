import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req,res,next) => {
    const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "") // hum headers e.g postman mein headers mein Authorization key ke saath kuchh is tarike ki value Bearer <token> aise bhejte ho vo "Bearer <token> se hame koi lena dena nahi hai only token chahiye is liye

    if(!token){
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id).select("-password -refreshToken") // token generatin ke time ._id ka hi use kare the token generation mein

    if(!user){
        // TODO: discuss about frontend
        throw new ApiError(401,"Invalid Access Token")
    }

    req.user = user

    next()
}) 