import jwt from "jsonwebtoken";
import { user } from "../models/user.model.js";

const verifyUserJWT = asyncHandler( async (req, _ , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") ;
        if (!token) {
            throw new apiError(401 , "Unauthorized request");
        }
    
        const isAuthorized = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET) ;
    
        const User = await user.findById (isAuthorized._id).select(
            "-password -refreshToken"
        )

        if (!User) {
            throw new apiError(401 ,"Unauthorized request");
        }

        req.user = User ;
        next();
        
    } catch (error) {
        throw new apiError(401 , error?.message || "Unauthorized request")
    }

});

export default verifyUserJWT;