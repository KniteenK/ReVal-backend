import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Sign Up
export const signUp = asyncHandler(async (req, res, next) => {
    const { username, email, password, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ApiError(400, 'User already exists'));
    }

    const user = await User.create({ username, email, password, address });

    res.status(201).json({
        success: true,
        data: user
    });
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