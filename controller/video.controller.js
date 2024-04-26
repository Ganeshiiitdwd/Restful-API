import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from '../model/user.model.js'
import {ApiError}  from '../utils/APIError.js'
import {ApiResponse} from '../utils/APIResponse.js'
import {uploadOncloudinary} from '../utils/cloudinary.js'
import {Video} from '../model/video.model.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const publishVideo=asyncHandler(async(req,res)=>{
           const {title,description}=req.body
           if(!title){
            throw new ApiError(400,'Title Required')
           }
           if(!description){
            throw new ApiError(400,'Description Required')
           }
           const videopath=req.files?.videoFile[0]?.path
           const thumbnailpath=req.files?.thumbnail[0]?.path
           if(!videopath){
            throw new ApiError(500, "VIDEO PATH DOESN'T FOUND")
           }
           if(!thumbnailpath){
            throw new ApiError(500,"THUMBNAIL PATH NOT FOUND")
           }

           // uploading on cloudinary
           const video= await uploadOncloudinary(videopath)
           const thumbnail=await uploadOncloudinary(thumbnailpath)
           if(!video){
            throw new ApiError(500,"error while uploading video on cloudinary")
           }
           if(!thumbnail){
            throw new ApiError(500,"error while uploading thumbnail on cloudinary")
           }
           // creating the video in db
           const videodb= await Video.create({
                  title,
                  description,
                  owner:req.user?._id,
                  videofile:video.url,
                  thumbnail:thumbnail.url,
                  duration: video.metadata
           })

           // returning the data
           if(!videodb){
            throw new ApiError(500,"error while uploading the video")
           }

           return res.status(200).json(new ApiResponse(200,videodb,"video uploaded successfully"))

})


const getVideoById=asyncHandler(async(req,res)=>{
       const {videoId}=req.params
       if(!videoId){
              throw new ApiError(404,"VIDEO url is required")
       }
       const video= await Video.findById(videoId)
       if(!video){
              throw new ApiError(404,"VIDEO NOT FOUND")
       }
       res.status(200).json(new ApiResponse(200,video,"VIDEO HAS BEEN FETCHED"))
})

const updateVideoDetails=asyncHandler(async(req,res)=>{
         const {title,description}= req.body
         const {videoId}=req.params
        const video= await Video.findByIdAndUpdate(videoId,{title,description},{new:true})
        if(!video){
              throw new ApiError(400,"SOMETHING WENT WRONG WITH THE UPDATION OF VIDEO DETAILS")
        }
        return res.status(200).json(new ApiResponse(200,video,"Details Updated Successfully"))
})

const DeletingVideo=asyncHandler(async(req,res)=>{
       const {videoId}=req.body
       if(!videoId){
              throw new ApiError(404,"VIDEO ID NOT FOUND")
       }
      try {
        await Video.findByIdAndDelete(videoId)
        return res.status(200).json(new ApiResponse(200,{},"VIDEO DELETED SUCCESSFULLY"))
      } catch (error) {
           console.log(error.message)
      }
})

const getVideoAsperSearch=asyncHandler(async(req,res)=>{
          try {
              const text=req.query.search
              const keyword=text?{ $or:[{ title:{$regex:text,$options:'i'}},{description:{$regex:text,$options:'i'}}]}:{}
              const getVideos=await Video.find(keyword)
              return res.status(200).json(new ApiResponse(200,getVideos,"SEARCH RESULT"))
          } catch (error) {
               console.log(error.message)
          }

})

export {publishVideo,getVideoById,updateVideoDetails,DeletingVideo,getVideoAsperSearch}