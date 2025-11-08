import {asyncHandler} from "../utils/asyncHandler.js"; 
import {ApiError} from "../utils/ApiError.js";
import {user} from "../models/user.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js";
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

   if(full==="") {
    throw new ApiError(400,"fullName is required")
   }
   if (
    [fullName, email, password, username].some((field) =>
    field?.trim () === "") ) {
      throw new ApiError(400,"All fields are required")
   }


  const existedUser =  user.findOne({
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

   

  } )
  



export {
   registerUser
  };
