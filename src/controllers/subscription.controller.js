import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }
    if (channelId === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself")
    }
    const subscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })
    if (subscription) {
        await Subscription.deleteOne({
            subscriber: req.user._id,
            channel: channelId
        })
        res
        .status(200)
        .json(new ApiResponse(true, "Unsubscribed successfully"))
    } else {
        await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })
        res
        .status(200)
        .json(new ApiResponse(true, "Subscribed successfully"))
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscribers = await Subscription.find({
        channel: channelId
    }).populate("subscriber", "username email")
    res
    .status(200)
    .json(new ApiResponse(true, "Subscribers fetched successfully", subscribers))
     
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const subscriptions = await Subscription.find({
        subscriber: subscriberId
    }).populate("channel", "username email")
    res
    .status(200)

    .json(new ApiResponse(true, "Subscribed channels fetched successfully", subscriptions)) 
       
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}