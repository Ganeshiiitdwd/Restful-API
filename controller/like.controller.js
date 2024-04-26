import {Like} from '../model/likes.model.js'
import {ApiError}  from '../utils/APIError.js'
import {ApiResponse} from '../utils/APIResponse.js'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'

const toggleVideoLike=asyncHandler(async(req,res)=>{
            const {videoId}=req.params
            // toggle means like hai toh delete karo aur like na ho toh like karo
            const like= await Like.findOne({video:videoId})
            if(!like){
                const likef= await Like.create({video:videoId,likedBy:req.user?._id})
                return res.status(200).json(new ApiResponse(200,likef,"VIDEO LIKED"))
            }
            await Like.findByIdAndDelete(like._id)
            return res.status(200).json(new ApiResponse(200,{},"UNLIKE VIDEO SUCCESSFULLY"))
})

const toggleCommentLike=asyncHandler(async(req,res)=>{
        const {commentId}=req.params
        const like = await Like.findOne({comment:commentId})
        if(!like){
            const likef=await Like.create({comment:commentId,likedBy:req.user?._id})
            return res.status(200).json(new ApiResponse(200,likef,"COMMENT LIKED SUCCESSFULLY"))
        }
        await like.findByIdAndDelete(like._id)
        return res.status(200).json(new ApiResponse(200,{},"UNLIKE COMMENT SUCCESSFULLY"))
})

const toggleTweetLike=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    const like = await Like.findOne({tweet:tweetId})
    if(!like){
        const likef=await Like.create({tweet:tweetId,likedBy:req.user?._id})
        return res.status(200).json(new ApiResponse(200,likef,"TWEET LIKED SUCCESSFULLY"))
    }
    await like.findByIdAndDelete(like._id)
    return res.status(200).json(new ApiResponse(200,{},"UNLIKE TWEET SUCCESSFULLY"))
})

const getAllVideoLike=asyncHandler(async(req,res)=>{
     const userId=req.user?._id
     if(!userId){
        throw new ApiError(404,"USERID NOT FOUND")
     }
     try {
        const like= await Like.find({likedBy:userId,video: { $exists: true }})   // just retrieving where video field exist
        return res.status(200).json(new ApiResponse(200,like,"ALL VIDEOS LIKE"))
     } catch (error) {
         console.log(error.message)
     }

})
export {toggleVideoLike,toggleCommentLike,toggleTweetLike,getAllVideoLike}