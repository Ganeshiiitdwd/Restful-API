import {Tweet} from '../model/tweet.model.js'
import {ApiError}  from '../utils/APIError.js'
import {ApiResponse} from '../utils/APIResponse.js'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'


const TweetPosting=asyncHandler(async(req,res)=>{
         const {content} =req.body

         if(!content){
            throw new ApiError(400,"Content Must be Their")
         }

         const userId=req.user?._id
         const tweet= await Tweet.create({
            content,
            owner:userId
         })
        return res.status(200).json(new ApiResponse(200,tweet,"TWEET CREATED SUCCESSFULLY"))
})

const TweetDeleting=asyncHandler(async(req,res)=>{
          const {id}=req.params
          if(!id){
            throw new ApiError(400,"ID of the Tweet Must be passed")
          }

          try {
            const tweet= await Tweet.findById(id)
            if(!tweet){
                throw new ApiError(400,"TWEET DOESN'T EXIST")
            }
            console.log(tweet?.owner.toString())
            console.log(req.user?._id.toString())
            // if(tweet?.owner===req.user?._id){
            //     throw new ApiError(400,"YOU CAN'T DELETE THE TWEET AS YOU ARE NOT OWNER OF IT")
            // }
            await Tweet.findByIdAndDelete(id)
            return res.status(200).json(new ApiResponse(200,{},"TWEET DELETED SUCCESSFULLY"))
          } catch (error) {
              console.log(error.message)
          }
       
})


const TweetUpdate=asyncHandler(async(req,res)=>{
      const {updateid}=req.params
      const {newContent}=req.body
      if(!updateid){
        throw new ApiError(400,"Tweet Id required")
      }
      if(!newContent){
        throw new ApiError(400,"NEWCONTENT is required")
      }
    try {
        const tweet= await Tweet.findByIdAndUpdate(updateid,{content:newContent},{new:true})
        if(!tweet){
          throw new ApiError(400,"TWEET CAN'T BE UPDATED , NO record with mentioned id")
        }
        return res.status(200).json(new ApiResponse(200,tweet,"TWEET UPDATED SUCCESSFULLY"))
    } catch (error) {
        console.log(error.message)
    }

})


const getUserTweet=asyncHandler(async(req,res)=>{
       const tweet= await Tweet.find({owner:req.user?._id})
       if(!tweet){
        throw new ApiError(500,"SOMETHING went wrong wwhile accessing the tweet corresponding to user")
       }
       return res.status(200).json(new ApiResponse(200, tweet,"ALL tweets fetched successfully"))
})
export {TweetPosting,TweetDeleting,TweetUpdate,getUserTweet}