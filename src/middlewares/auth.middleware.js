import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const verifyUserJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const isAuthorized = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(isAuthorized._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request");
    }
});

export default verifyUserJWT;