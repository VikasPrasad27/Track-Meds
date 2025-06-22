import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/User.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    // console.log("Received token:", token ? "Token present" : "No token")

    if (!token) {
      throw new ApiError(401, "Unauthorized request - No token provided")
    }
    if (typeof token !== "string" || token.split(".").length !== 3) {
      console.log("Invalid token format:", token) // Debug log
      throw new ApiError(401, "Invalid token format")
    }

    let decodedToken
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (jwtError) {
      console.log("JWT verification error:", jwtError.message) // Debug log

      res.clearCookie("accessToken")
      res.clearCookie("refreshToken")

      if (jwtError.name === "JsonWebTokenError") {
        throw new ApiError(401, "Invalid access token")
      } else if (jwtError.name === "TokenExpiredError") {
        throw new ApiError(401, "Access token expired")
      } else {
        throw new ApiError(401, "Token verification failed")
      }
    }

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if (!user) {
      throw new ApiError(401, "Invalid access token - User not found")
    }

    req.user = user
    next()
  } catch (error) {
    // console.error("Auth middleware error:", error.message)

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    throw new ApiError(401, error?.message || "Invalid access token")
  }
})
