import { user } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";;
import {apiError} from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const signUp = asyncHandler ( async (req , res) => {
    try {
        const {username , email , password,gender, age} = req.body ;

    
        if (
            [username, email, password, continent, subRegion].some((field) => field.trim() === "")
        ){
            throw new Error("All fields are required") ;
        }
    
        const isExisting = await user.findOne({
            $or: [{ username }, { email }]
        }) ;
    
        if (isExisting) {
            throw new Error("User already exists") ;
        } ;
        
        const isUser = await user.create({
            username,
            email,
            password,
            gender,
            age,
            allergies,
            region: {
                continent,
                subRegion,
            },
        }) ;
    
        if (!isUser) {
            throw new Error("Failed to create user") ;
        }
        
        const accessToken = isUser.generateAccessToken()
        const refreshToken = isUser.generateRefreshToken()
        isUser.accessToken = accessToken
        isUser.save({ validateBeforeSave: false })


        // console.log(isClient)
    
        return res.status(201).json(
            new apiResponse(200 , {isUser , accessToken , refreshToken} , "User created successfully") 
        )

    } catch (error) {
        console.log('error: ', error.message) ;
    }


}) ;

const signOut = asyncHandler(async (req, res) => {
    await user.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                accessToken: 1
            }
        },
        { 
            new: true  
        }
    )

    return res
    .status(200)
    .json(new apiResponse(200, {}, "User logged Out Successfully"))
});

const signIn = asyncHandler(async (req, res) => {

    const { email, password } = req.body ;

    if (!email) {
        throw new apiError(400, "Email is required");
    }

    const query = {email }

    const User = await user.findOne(query);

    // Check password validity
    const isPasswordCorrect = await User.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new apiError(401, "Invalid password");
    }

    try {
        // Generate access and refresh tokens
        const accessToken = await User.generateAccessToken();
        const refreshToken = await User.generateRefreshToken();

        // Save refreshToken in the user document
        User.refreshToken = refreshToken;
        await User.save({ validateBeforeSave: false });

        // Select the necessary user fields, omitting sensitive data
        const userData = await user.findById(User._id).select(
                "-password -refreshToken"
            );

        return res.status(200)
            .json(
                new apiResponse(200, {
                    userData,
                    accessToken,
                    refreshToken,
                }, "User logged in successfully")
            );

    } catch (error) {
        throw new apiError(500, error.message || "Some error occurred while logging in");
    }
});


export {
    signIn, signOut, signUp
};
