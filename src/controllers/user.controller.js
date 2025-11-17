import {asyncHandler} from "../utils/asyncHandler.js"; 
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async(userId){
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

  }
catch (error) {
  throw new ApiError(500, "something went wrong while generating access and refresh token ")
}


}
const registerUser = asyncHandler(async (req, res) => {
  // get  user details from frontend
  // validation -- not empty 
  // check if user already exists: username or email 
  // check for images 
  // check for avatar 
  // upload them to cloudinary, avatar 
  // create user object - create entry in db 
  // remove password and refresh toke field from response 
  // check if user created successfully
  // return response
  

   const {fullName, email, password, username} = req.body

   console.log("email: ", email);

   if(fullName==="") {
    throw new ApiError(400,"fullName is required")
   }
   if (
    [fullName, email, password, username].some((field) =>
    field?.trim () === "") ) {
      throw new ApiError(400,"All fields are required")
   }


  const existedUser =  await User.findOne({
    $or: [{  email  }, {  username  }]


   })

   if(existedUser) {
    throw new ApiError(409,"User already exists with this email or username")
    
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath) {
    throw new ApiError (400, "Avatar file is required");
   }

   const avatar = await  uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url  || "",
    email,
    password,
    username: username.toLowerCase()
   }) 

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken "
   )

   if(!createdUser) { 
    throw new ApiError(500,"User registration failed, please try again later");

   }

return res.status (201).json (
  new ApiResponse (200, createdUser, "User registered successfully")
)
     

  } )
  
  const loginUser = asyncHandler( async (req, res) => {

    // get username and password from req.body
    // validate not empty 
    // check if user exists 
    // match the password 
    // generate jwt token (access token and refresh token )
    // send cookies 
    // return response 
  
    const { email, username, password } = req.body

    if(!username || !email){
      throw new ApiError(400,"Username or email are required");
    }

    const user = await User.findOne({
      $or: [{email}, {username}]
    })
    if(!user) {
      throw new ApiError(404,"User not found with this email or username"); 
    }
    const isPasswordValid = await user.ispasswordCorrect(password)
 
    if(!isPasswordValid) {
      throw new ApiError(401,"Invalid user credentials")
    }
    
   const {accessToken, refreshToken} = await
    generateAccessAndRefreshTokens(user._id)

    await User.findById(user._id).
    select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loginUser, accessToken,
          refreshToken 
        },
        "User logged in Successfully"
      )
    )




  })



  const logoutUser = asyncHandler(async(req,res) =>{
    User.findById





  })

export {
   registerUser,
   loginUser,
   logoutUser
  };
 