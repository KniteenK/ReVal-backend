import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';
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

    const accessToken = isUser.generateAccessToken();
    const refreshToken = isUser.generateRefreshToken();
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

// Sign In
export const logIN = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        return next(new ApiError(401, 'Invalid email or password'));
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
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
    res.status(200).json({
        success: true,
        message: 'User signed out successfully'
    });
});


const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized Request");
    }
    
   try {
     const decodedToken = jwt.verify(incomingRefreshToken, process.env.ACCESS_REFRESH_TOKEN) ;
     
     const hustler = Hustler.findById(decodedToken?._id)
     
     if (!hustler) {
         throw new apiError(401, "Invalid Refresh Token");
     }
 
     if (decodedToken !== hustler?.refreshToken) {
         throw new apiError(401, "Refresh Token is expired");
     }
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     const token = await generateAccessToken(hustler._id) 
 
     return res.status(200)
     .cookies("refreshToken" , token)
     .json(
         new apiResponse(200, {
             accessToken: token
         }, "Access token refreshed successfully")
     )
   } catch (error) {
     throw new apiError(500, error?.message || "Failed to refresh access token");
   }
    
})



export { signUp };
