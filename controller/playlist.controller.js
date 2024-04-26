import { Playlist} from '../model/playlist.model.js'
import {ApiError}  from '../utils/APIError.js'
import {ApiResponse} from '../utils/APIResponse.js'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'
import {User} from '../model/user.model.js'
const createPlaylist=asyncHandler(async(req,res)=>{
      const {name,description}=req.body
      // here we are just creating the playlist not inserting the video
      // refer to -: https://chat.openai.com/c/d5ebfbd4-4838-480e-9600-4f4fe0cae76a  for some special info
      if(!name){
        throw new ApiError(404,"Name of the Playlist is required")
      }
      if(!description){
        throw new ApiError(404,"Description of the Playlist is required")
      }
      const playlist= await Playlist.create({name,description,owner:req.user?._id})
      if(!playlist){
        throw new ApiError(400,"SOMETHING WEN WRONG WHILE CREATING THE PLAYLIST")
      }
      return res.status(200).json(new ApiResponse(200,playlist,'PLAYLIST CREATED SUCCESSFULLY'))
})

const getUserplaylist=asyncHandler(async(req,res)=>{
     const {userId}=req.params

     if(!userId){
        throw new ApiError(404,'USER ID NOT FOUND')
     }

     const playlists= await Playlist.find({owner:userId}).populate('owner')
     if(!playlists){
        throw new ApiError(500,"SOMETHING WENT WRONG WHILE ACCESSING ALL PLAYLIST")
     }

     return res.status(200).json(new ApiResponse(200,playlists,"PLAYLISTS FETCHED SUCCESSFULLY"))
})

const getplaylistbyId=asyncHandler(async(req,res)=>{
    const {pid}=req.params
    if(!pid){
        throw new ApiError(404,'PLAYLIST ID NOT FOUND')
    }
    const playlist= await Playlist.findById(pid)
    return res.status(200).json(new ApiResponse(200,playlist,"PLAYLIST FETCHED SUCCESSFULLY"))
})

const AddVideoToPlaylist=asyncHandler(async(req,res)=>{
         const {playlistId,videoId}=req.body
         if(!playlistId){
            throw new ApiError(400,"playlist id is required")
         }
         if(!videoId){
            throw new ApiError(400,"videoId is required to insert video into playlist")
         }

      try {
            const plist= await Playlist.findById(playlistId)
            if(!plist){
                throw new ApiError(404,"PLAYLIST DOESN'T FOUND")
            }
            if(plist.videos.includes(videoId)){
                throw new ApiError(400,"VIDEO ALREADY EXIST IN THE PLAYLIST")
            }
           const playlist= await Playlist.findByIdAndUpdate(playlistId,{ $push:{videos:videoId}},{new:true})
           return res.status(200).json(new ApiResponse(200,playlist,"VIDEO ADDED TO PLAYLIST SUCCESSFULLY"))
      } catch (error) {
           console.log(error.message)
      } 
})

const removeVideoFromPlaylist=asyncHandler(async(req,res)=>{
    const {playlistId,videoId}=req.body
    if(!playlistId){
       throw new ApiError(400,"playlist id is required")
    }
    if(!videoId){
       throw new ApiError(400,"videoId is required to insert video into playlist")
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if the videoId exists in the videos array of the playlist
    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video doesn't exist in the playlist");
    }
    
    const playlistnew= await Playlist.findByIdAndUpdate(playlistId,{$pull:{videos:videoId}},{new :true})
    return res.status(200).json(new ApiResponse(200,playlistnew,"VIDEO REMOVED SUCCESSFULLY"))
})
export {createPlaylist,getUserplaylist,getplaylistbyId,AddVideoToPlaylist,removeVideoFromPlaylist}