import {Comment} from '../model/comment.model.js'
import {ApiError}  from '../utils/APIError.js'
import {ApiResponse} from '../utils/APIResponse.js'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'

const addComment=asyncHandler(async(req,res)=>{
         const {content}=req.body
         const {videoId}=req.params
         if(!content){
            throw new ApiError(404,"CONTENT IN COMMENT REQUIRED")
         }
         const comment=await Comment.create({
            content, owner:req.user?._id, video:videoId
         })
         if(!comment){
            throw new ApiError(404,"Comment Created Successfully")
         }
         res.status(200).json(new ApiResponse(200,comment,'COMMENT POSTED SUCCESSFULLY'))
})

const getAllCommentsforVideo=asyncHandler(async(req,res)=>{
             const {videoId}=req.params
             if(!videoId){
               throw new ApiError(404,"VIDEOID NOT FOUND IN URL")
             }
             const comments= await Comment.find({video:videoId})
             res.status(200).json(new ApiResponse(200,comments,'ALL COMMENTS FOR CORRESPONDING VIDEO FETCHED SUCCESSFULLY'))
})

const updateComment=asyncHandler(async(req,res)=>{
      const {content,cid}=req.body
      if(!content){
         throw new ApiError(404,"CONTENT IS REQUIRED TO UPATE THE COMMENT")
      }
      if(!cid){
         throw new ApiError(404,"COMMENT ID IS REQUIRED")
      }
     try {
       const comment= await Comment.findByIdAndUpdate(cid,{content},{new:true})
 
     return  res.status(200).json(new ApiResponse(200,comment,"COMMENT UPDATED SUCCESSFULLY"))
     } catch (error) {
            console.log(error.message)
     }

})


const deleteComment=asyncHandler(async(req,res)=>{
       const {commentId}=req.body
       if(!commentId){
         throw new ApiError(404,"COMMENTID REQUIRED TO DELETE IT")
       }
     try {
        await Comment.findByIdAndDelete(commentId)
        return res.status(200).json(new ApiResponse(200,{},"COMMENT DELETED SUCCESSFULLY"))
     } catch (error) {
           console.log(error.message)
     }
   
})

export {addComment,getAllCommentsforVideo,updateComment,deleteComment}