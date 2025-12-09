import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
      const filter = { isDeleted: false }
      if (query) {
         filter.$or = [
             { title: { $regex: query, $options: 'i' } },
               { description: { $regex: query, $options: 'i' } }
         ]
      }
      if (userId && isValidObjectId(userId)) {
         filter.uploadedBy = userId
      }
      const sortOptions = {}
      if (sortBy) {
         const sortField = sortBy
         const sortOrder = sortType === 'desc' ? -1 : 1
         sortOptions[sortField] = sortOrder
      }
      const videos = await Video.find(filter)
         .sort(sortOptions)
         .skip((page - 1) * limit)
         .limit(parseInt(limit))
         .populate('uploadedBy', 'username fullName')
      const totalVideos = await Video.countDocuments(filter)
      return res
         .status(200)
         .json(new ApiResponse(200, {
             videos,
             pagination: {
                   total: totalVideos,
                     page: parseInt(page),
                     limit: parseInt(limit),
                     totalPages: Math.ceil(totalVideos / limit)
             }
         }, 'Videos fetched successfully'))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
      if(!title || !description) {
         throw new ApiError(400, "Title and description are required")
      }
      if(!req.file) {
         throw new ApiError(400, "Video file is required")
      }
      const uploadResult = await uploadOnCloudinary(req.file.path, 'videos')
      const newVideo = new Video({
         title,
         description,
         videoUrl: uploadResult.secure_url,
         duration: uploadResult.duration,
         uploadedBy: req.user._id
      })
      await newVideo.save()
      return res
      .status(201)
      .json(new ApiResponse(201, newVideo,
         "Video published successfully"))
         

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
      if(!isValidObjectId(videoId)){
         throw new ApiError (400, "Invalid video id")
      }
      const video = await Video.findById(videoId)
      .populate('uploadedBy', 'username fullName')
      if(!video || video.isDeleted){
         throw new ApiError(404, "Video not found")
      }
      return res
      .status(200)
      .json(new ApiResponse(200, video,
       "Video fetched successfully"))
       
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!title || !description || !thumbnail) {
      throw new ApiError(400, "Title, description and thumbnail are required")
    }

    const video = await video.findByIdAndUpdate(
      req.params?.videoId,
      {
        $set:{
         title:title,
         description:description,
         thumbnail:thumbnail,
         }
      },
      {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, video,
     "Video details updated successfully"))
   })


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)){
      throw new ApiError (400, "Invalid video id")
    }

    const video = await video.findByIdAndUpdate(
      req.params?.videoId,
      {
         $set:{
            isDeleted:true,
         }
      }
      ).select("-password")
      return res
      .status(200)
      .json(new ApiResponse(200, video,
       "Video deleted successfully")

    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle publish status of a video
      if(!isValidObjectId(videoId)){
         throw new ApiError (400, "Invalid video id")
      }

      const video = await video.find
      .findByIdAndUpdate(
         req.params?.videoId,
         {
            $set:{
               isPublished: !video.isPublished,
            }
         }
         ).select("-password")
         return res
         .status(200)
         .json(new ApiResponse(200, video,
          "Video publish status toggled successfully")
         )

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}


