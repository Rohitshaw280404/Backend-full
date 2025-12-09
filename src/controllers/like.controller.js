import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const video = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })
    if (video) {
        await Like.deleteOne({
            video: videoId,
            likedBy: req.user._id
        })
        res.status(200).json(new ApiResponse(true, "Video unliked successfully"))
    } else {
        await Like.create({
            video: videoId,
            likedBy: req.user._id
        })
        res.status(200).json(new ApiResponse(true, "Video liked successfully"))
    }          
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const comment = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })
    if (comment) {
        await Like.deleteOne({
            comment: commentId,
            likedBy: req.user._id
        })
        res
        .status(200)
        .json(new ApiResponse(true, "Comment unliked successfully"))
    } else {
        await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })
        res.status(200).json(new ApiResponse(true, "Comment liked successfully"))
    }


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const tweet = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })
    if (tweet) {
        await Like.deleteOne({

            tweet: tweetId,    
            likedBy: req.user._id
        })   
       res
       .status(200)
        .json(new ApiResponse(true, "Tweet unliked successfully"))
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })
        res
        .status(200)
        .json(new ApiResponse(true, "Tweet liked successfully"))

    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: {$ne: null}
    }).populate("video")
    res
    .status(200)
    .json(new ApiResponse(true, "Liked videos fetched successfully", likedVideos))

        


})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}