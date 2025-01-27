import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Sign Up
export const signUp = asyncHandler(async (req, res, next) => {
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

    const accessToken = isUser.generateAccessToken();
    const refreshToken = isUser.generateRefreshToken();

    if (!accessToken || !refreshToken) {
        return next(new ApiError(500, "Failed to generate tokens"));
    }

    isUser.accessToken = accessToken;
    await isUser.save({ validateBeforeSave: false });

    const options = {
        httpOnly: true,
        secure: true
    };

    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);

    return res.status(201).json(
        new apiResponse(200, { isUser, accessToken, refreshToken }, "User created successfully")
    );
});

// log In
export const logIN = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        return next(new ApiError(401, 'Invalid email or password'));
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
        return next(new ApiError(500, "Failed to generate tokens"));
    }

    user.accessToken = accessToken;
    await user.save({ validateBeforeSave: false });

    const options = {
        httpOnly: true,
        secure: true
    };

    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);

    res.status(200).json({
        success: true,
        data: user,
        message: "User logged in successfully"
    });
});

// Sign Out
export const signOut = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                accessToken: 1
            }
        },
        { 
            new: true  
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged out successfully"));
});


