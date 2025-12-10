import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
      const {getChannelVideos} = req.params
      const totalVideos = await Video.countDocuments({owner: getChannelVideos})
      const totalViewsAgg = await Video.aggregate([
          { $match: { owner: mongoose.Types.ObjectId(getChannelVideos) } },
          { $group: { _id: null, totalViews: { $sum: "$views" } } }
      ])
      const totalViews = totalViewsAgg.length > 0 ? totalViewsAgg[0].totalViews : 0
      const totalSubscribers = await Subscription.countDocuments({channel: getChannelVideos})
      const likedVideos = await Like.find({videoOwner: getChannelVideos})
      const totalLikes = likedVideos.reduce((acc, like) => acc + like.likesCount, 0)
        return res
        .status(200)
        .json(new ApiResponse(200, {
            totalVideos,
            totalViews,
            totalSubscribers,
            totalLikes
        }, "Channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {getChannelVideos} = req.params
    const videos = await Video.find({owner: getChannelVideos})
    return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"))
    
})

export {
    getChannelStats, 
    getChannelVideos
    }