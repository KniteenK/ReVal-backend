import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from '../utils/asyncHandler.js';
// Sign Up
const signUp = asyncHandler(async (req, res) => {
    const { username, email, password, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ApiError(400, 'User already exists'));
    }

    if (
        [username, email, password, address].some((field) => field.trim === "")
    ){
        throw new Error("All fields are required") ;
    }
    const isUser = await User.create({ username, email, password, address });
    if (!isUser) {
        throw new Error("Failed to create user") ;
    }

    return res.status(201).json(
        new apiResponse(200 , {isUser} , "User created successfully") 
    )
});

// Sign In
export const logIN = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        return next(new ApiError(401, 'Invalid email or password'));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// Sign Out
export const signOut = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'User signed out successfully'
    });
});
export {
    signUp
};

