import {Subscribe} from '../model/subscribe.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError}  from '../utils/APIError.js'
import {ApiResponse} from '../utils/APIResponse.js'
import mongoose from 'mongoose'
// https://chat.openai.com/c/d5ebfbd4-4838-480e-9600-4f4fe0cae76a  to get info about the behaviour of the js with the array returned
const toggleSubscription=asyncHandler(async(req,res)=>{
          const {channelId}=req.params
           if(!channelId){
            throw new ApiError(404,"CHANNEL ID NOT FOUND")
           }

           const subscribe=await Subscribe.find({subscribe:req.user?._id,channel:channelId}) 
           console.log(subscribe)
           if(subscribe.length===0){
              const newSubscriber= await Subscribe.create({subscribe:req.user?._id,channel:channelId})
              return res.status(200).json(new ApiResponse(200,newSubscriber,"CHANNEL SUBSCRIBED"))
           }
           await Subscribe.findByIdAndDelete(subscribe[0]._id)
          
           return res.status(200).json(new ApiResponse(200,{},"CHANNEL UNSUBSCRIBE"))

})

const getListofSUbscriber=asyncHandler(async(req,res)=>{
         const {channelId}=req.params

         if(!channelId){
            throw new ApiError(400,'CHANNEL ID IS REQUIRED')
         }
         const listsubcriber= await Subscribe.find({channel:channelId})
          return res.status(200).json(new ApiResponse(200, listsubcriber,"LIST OF SUBSCRIBER"))
})

const getListofChannelSubscribed=asyncHandler(async(req,res)=>{
       const {subscriberId}=req.params
      if(!subscriberId){
         throw new ApiError(404,"SUBSCRIBER ID IS REUIRED")
      }
      const listchannel= await Subscribe.find({subscribe:subscriberId})
      return res.status(200).json(new ApiResponse(200,listchannel,"LIST OF CHANNEL SUBSCRIBED TO"))
})

export {toggleSubscription,getListofChannelSubscribed,getListofSUbscriber}