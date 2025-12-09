import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const query = Comment.aggregate([
        {$match: {video: mongoose.Types.ObjectId(videoId)}},
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {$unwind: "$owner"},
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                "owner._id": 1,
                "owner.username": 1,
                "owner.avatar": 1
            }

        }
    ])
    const options = {page: parseInt(page, 10), limit: parseInt(limit, 10)}
    const results = await Comment.aggregatePaginate(query, options)
    res
    .status(200)
    .json(new ApiResponse(true, "Comments fetched successfully", results))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    if (!content) {
        throw new ApiError(400, "Content is required")
    }
    const comment = new Comment({
        content,
        video: videoId,
        owner: req.user._id
    })
    await comment.save()
    res
    .status(201)
    .json(new ApiResponse(true, "Comment added successfully", comment))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    if (!content) {
        throw new ApiError(400, "Content is required")
    }
    const comment = await Comment.find
ById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }
    comment.content = content
    await comment.save()
    res
    .status(200)
    .json(new ApiResponse(true, "Comment updated successfully", comment))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment")
    }
    await comment.remove()
    res
    .status(200)
    .json(new ApiResponse(true, "Comment deleted successfully"))
    
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }