import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';
// Sign Up
const signUp = asyncHandler(async (req, res, next) => {
    const { username, email, password, address } = req.body;
    console.log(req.body);

    if (!username || !email || !password || !address) {
        return next(new ApiError(400, "All fields are required"));
    }

    if (typeof username !== 'string' || username.trim() === "" ||
        typeof email !== 'string' || email.trim() === "" ||
        typeof password !== 'string' || password.trim() === "" ||
        typeof address !== 'object' || !address.street || !address.city || !address.state) {
        return next(new ApiError(400, "All fields are required and must be valid"));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ApiError(400, 'User already exists'));
    }

    const isUser = await User.create({ username, email, password, address });
    if (!isUser) {
        return next(new ApiError(500, "Failed to create user"));
    }

    return res.status(201).json({
        success: true,
        data: isUser,
        message: "User created successfully"
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

export {
    signUp
};
