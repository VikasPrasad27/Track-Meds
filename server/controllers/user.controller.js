import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/User.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken= user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"SOMETHING WENT WRONG WHILE GENERATING REFRESH AND ACCESS TOKEN")
    }
}

const registerUser = asyncHandler (async(req,res)=>{
    //get user from frontend
    const {name,email,password}=req.body;
    //validation-not empty
    if(
        [name,email,password].some((filed)=>    //we can also use if else if for each on
         filed?.trim()==="")    
    ) {
        throw new ApiError(400,"All fields are required")
    }
    //check if user already exist:email
    const existedUser = await User.findOne({email});
    if(existedUser){
        throw new ApiError(409,"User with Email already exists");
    }
    //check for images

    const profileLocalPath = req.files?.profileimg[0]?.path; // multer image path
    if(!profileLocalPath){
        throw new ApiError(400,"Profile imgage is required")
    }
    //upload onn cloudinary
    const profileimg = await uploadOnCloudinary(profileLocalPath);
     if(!profileimg){
        throw new ApiError(400,"Profile imgage required")
    }
    //creat user object in db
    const user = await User.create({
        name,
        profileimg:profileimg.url,
        email,
        password
    }) 
    //remove pass and refresh token from response
     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"          // what we dont want
    );
    //check for user creation
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }
    //return res   
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )
   
    
})

const loginUser = asyncHandler(async(req,res)=>{
    //req body->data
    const {email,password} = req.body
    //email based login
    if(!email){
        throw new ApiError(400,"Email is required");
    }
    //check user
    const user=await User.findOne({email})
    if(!user){
        throw new ApiError(404,"Email does not exist")
    }
    //check password
    const isPasswordValid=await user.isPasswordCorrect(password); //we use user because we want to access the methods and User for database mongoose tasks 
    if(!isPasswordValid){
        throw new ApiError(401,"Incorrect user credentials")
    }
    //access and refresh token
    const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)
    //send cookie
    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")
    
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedInUser,accessToken,refreshToken
        }),
        "User Logged in seccessfully"
    )

    //successfull login message 
})

const logoutUser = asyncHandler (async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged out")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
    const user = await User.findById(req.user?._id)

    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400,"Invalid Password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res.status(200).json(new ApiResponse(200,{},"Password changed successfully"))

})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200).json(200,
        req.user
    ,"Current user fetched successfully")
})

const updateUserProfileImg = asyncHandler(async(req,res)=>{
    const profileLocalPath = req.file?.path
    if (!profileLocalPath) {
        throw new ApiError(400,"Profile img missing")
    }

    const profileimg = await uploadOnCloudinary(profileLocalPath)
     if (!profileimg.url) {
        throw new ApiError(400,"Error while uploading Profile Img")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            profileimg:profileimg.url
        }
    },{new:true}).select("-password")

    return res.status(200).json(200,user,"Profile Img updated")
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    updateUserProfileImg
}