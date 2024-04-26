import {ApiError} from '../utils/APIError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from '../model/user.model.js'
import jwt from 'jsonwebtoken'

export const  verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
         const token=req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer ","")  // we are retriveing accessToken in form of cookie or in form of authorization Bearer as what we did in chat application
         if(!token){
            throw new ApiError(400,'Unauthorized Access')
         }
         const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
             // verifying the token it takes two parameter normal token and the secrete key
             // this decodedtoken contains the id, username, email as that is what we use while creating in the usermodel
         const user= await User.findById(decodedtoken?._id).select('-password -refreshtoken')
         if(!user){
            throw new ApiError(409,"Invalid Access Token")
         }
         // to creating our own method to access with .user
         req.user=user
         next()  //it is very important as this makes middlewware diff from fn as we are passing it to next stage that's why next()
    } catch (error) {
        throw new ApiError(401, error?.message||"Invalid token")
    }
})