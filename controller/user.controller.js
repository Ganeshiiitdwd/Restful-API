import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from '../model/user.model.js'
import {ApiError}  from '../utils/APIError.js'
import {ApiResponse} from '../utils/APIResponse.js'
import {uploadOncloudinary} from '../utils/cloudinary.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
 // try and catch block part will be performed by asynchandler u can use try catch also and the return functionality is also defined in asynchandler hence no need to write return here if u write won't be any problem
const registerUser=asyncHandler(async(req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName,email,username,password}=req.body
    if(!fullName){
         throw new ApiError(400,'FullName is required ')
    }
    if(!email){
        throw new ApiError(400,'Email is required')
    }
    if(!username){
        throw new ApiError(400,'Username is required')
    }
    if(!password){
        throw new ApiError(400,'Password is required')
    }

    const existedUser= await User.findOne({$or:[{username},{email}]})   //finding if user exist with same username or email
    if(existedUser){
        throw new ApiError(409,'User already exists with given name or email')
    }
    // accessing the path of the files saved with the help of multer middleware
    const avatarlocalpath= req.files?.avatar[0]?.path
    // const coverImagepath=req.files?.coverImage[0]?.path
    
    let coverImagepath;
     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImagepath=req.files.coverImage[0].path
     }
    if(!avatarlocalpath || !coverImagepath){
        throw new ApiError(400, 'Something Wrong with file saving and multer')
    }
    // uploading on cloudinary 
    console.log(avatarlocalpath)
  const avatar=await  uploadOncloudinary(avatarlocalpath)
  const coverImage=await uploadOncloudinary(coverImagepath)

  if(!avatar){
    throw new ApiError(400,'Avatar is Required')
  }


  // creating the user

  const user=await User.create({
    username,
    email,
    fullname:fullName,
    avatar:avatar.url,
    coverImage:coverImage.url,
    password
  })
  
  // validating if user created or not
   // now we wanna get the tokens
   const {accessToken,refreshToken}=await generateAccessandRefreshToken(user._id)
   const loggedInuser=await User.findById(user._id).select('-password -refreshtoken')

   // making cookies only updatable by server
   const options={
     httpOnly:true,
     secure:true
   }
// cookie-: HTTP cookies are small blocks of data created by a web server while a user is browsing a website and placed on the user's computer or other device by the user's web browser. 

   return res.status(200).cookie('accessToken',accessToken,options).cookie('refreshToken',refreshToken,options).json(new ApiResponse(200,{user:loggedInuser,accessToken,refreshToken},"User Registered and Saved Successfully"))

})



const getuser=async(req,res)=>{
  const user= await User.find({})
  if(!user){
    throw new ApiError(400,'No User Exist')
  }

  return res.status(200).json(new ApiResponse(200,user,'User Registered Successfully'))
}

// writing fn to get the tokens
const generateAccessandRefreshToken=async(userId)=>{
 try {
   const user= await User.findById(userId)
   const accessToken= await user.genereteAccessToken()  // remember this are methos not fn
   const refreshToken= await user.genereteRefreshToken()
 
   // saving the token in db
   user.refreshtoken=refreshToken
   await user.save({validateBeforeSave:false})
   return {accessToken,refreshToken}
 } catch (error) {
       throw new ApiError(500, 'Something went wrong while generating Tokens')
 }
}

// login controller
const logInUser=asyncHandler(async(req,res)=>{
  // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
  const {username,email,password}=req.body
  if(!(username||email)){
    throw new ApiError(400,'Username of email required')
  }
    const user= await User.findOne({$or:[{username},{email}]})
    
    if(!user){
      throw new ApiError(400,'No User exist with given username/email')
    }

    // remember here now we can't access the methods we define in the User schema as that are not associated with the 
    // mongoose we could use them with user that we retrieved from the db
    const ispasswordValid=await user.isPasswordCorrect(password)

    if(!ispasswordValid){
      throw new ApiError(400,'Invalid Password')
    }

    // now we wanna get the tokens
    const {accessToken,refreshToken}=await generateAccessandRefreshToken(user._id)
    const loggedInuser=await User.findById(user._id).select('-password -refreshtoken')

    // making cookies only updatable by server
    const options={
      httpOnly:true,
      secure:true
    }
// cookie-: HTTP cookies are small blocks of data created by a web server while a user is browsing a website and placed on the user's computer or other device by the user's web browser. 

    return res.status(200).cookie('accessToken',accessToken,options).cookie('refreshToken',refreshToken,options).json(new ApiResponse(200,{user:loggedInuser,accessToken,refreshToken},"User LoggedIn Successfully"))
})


//logout handler
const logOut=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate( req.user._id,{
      $unset:{
        refreshtoken:1
      },},
      {
        new:true    // this new true make sure the retrieved User would be new one
      }
)

const options={
httpOnly:true,
secure:true
}

return res.status(200).clearCookie('accessToken',options).clearCookie('refreshToken',options).json(new ApiResponse(200,{},"User Logged Out SuccessFully"))

})


// regeneration of tokens after expiry of the accessToken to keep user signin

const refreshAccessToken=asyncHandler(async(req,res)=>{
  // accessing refreshtoken from cookie
  const IncomingRefreshtoken= req.cookies.refreshToken||req.body.refreshToken

  if(!IncomingRefreshtoken){
    throw new ApiError(403,"Refresh Token is required")
  }
  try{
        // decoding the token
        const decoded= jwt.verify(IncomingRefreshtoken,process.env.REFRESH_TOKEN_SECRET)

        const usergot=await User.findById(decoded?._id)
        if(!usergot){
          throw new ApiError(400, "Token is Expired or wrong")
        }
      // cross checking the tokens
      if(IncomingRefreshtoken!==usergot.refreshtoken){
        throw new ApiError(400,"Invalid token not matching with any user in db")
      }

      const options={
        httpOnly:true,
        secure:true
      }
      // calling fn to regenerate the tokens

      const {accessToken,refreshToken}=await generateAccessandRefreshToken(usergot?._id)
   
      return res.status(200).cookie("accessToken",accessToken,options).cookie('refreshToken',refreshToken,options).json(new ApiResponse(200,{accessToken,refreshToken},"Access Token Generated"))


  }catch(error){
       throw new ApiError(400,error?.message||"Error in token generation unknown")
  }
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    
    return res.status(200).json(new ApiResponse(200,req.user,"User Sent SuccessFully"))
})

// controller for changin current password
const changeCurrentPassword=asyncHandler(async(req,res)=>{
       const { oldPassword,newPassword}=req.body
      //  if(!(oldPassword||newPassword)){
      //   throw new ApiError(400,"Old and New Password required")
      //  }

       const user= await User.findById(req.user?._id)
       const passwordvalidation=await user.isPasswordCorrect(oldPassword)   // checking if the current password is valid or not
       if(!passwordvalidation){
         throw new ApiError(400,"Invalid Password/ wrong password")

       }

       user.password=newPassword  //assingning the password
       await user.save({validateBeforeSave:false})

       return res.status(200).json(new ApiResponse(200,{},"Password updated Successfully"))


       


})


// for updating the avatar , it is always prefered to update the image with just normal change or update button at frontend rather than whole data together just to optimize the bandwidth and network

const updateavatar=asyncHandler(async(req,res)=>{
       const avtarpath= req.file?.path  // not using old files as we are dealing with single image here
        
       if(!avtarpath){
        throw new ApiError(400,"Avatar path access path , updation failed")
       }
       const avatar= await uploadOncloudinary(avtarpath)
       if(!avatar){
        throw new ApiError(400,"Something worng while updating avatar , cloudinary upload error")
       }

       const user= await User.findByIdAndUpdate(req.user?._id,{$set:{avatar:avatar.url}},{new:true}).select('-password')

       return res.status(200).json(new ApiResponse(200,user,"Avatar Updated Successfully"))
})


const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
      throw new ApiError(400, "Username is required to get the profile");
  }

  // Aggregate pipeline to retrieve user channel profile
  const channel = await User.aggregate([
      // Pipeline stage 1: Match user by username
      {
          $match: { username: username }
      },
      // Pipeline stage 2: Lookup subscribers for the user's channel
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers"
          }
      },
      // Pipeline stage 3: Lookup channels the user is subscribed to
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "subscribe",
              as: "subscribedTo"
          }
      },
      // Pipeline stage 4: Add fields for subscriber count, subscribed channel count, and subscription status
      {
          $addFields: {
              subscriberCount: { $size: "$subscribers" }, // Calculate the number of subscribers
              channelSubscribedToCount: { $size: "$subscribedTo" }, // Calculate the number of channels subscribed to by the user
              isSubscribed: {
                  $in: [req.user?._id, "$subscribedTo.subscribe"] // Check if the current user is subscribed to the channel
              }
          }
      },
      // Pipeline stage 5: Project fields to return in the response
      {
          $project: {
              fullname: 1,
              username: 1,
              subscriberCount: 1,
              channelSubscribedToCount: 1,
              isSubscribed: 1,
              avatar: 1,
              coverImage: 1,
              email: 1
          }
      }
  ]);

  // Check if channel exists
  if (!channel?.length) {
      throw new ApiError(404, "Channel Doesn't Exist with given username");
  }

  // Return user channel data
  return res.status(200).json(new ApiResponse(200, channel[0], "User Channel Data fetched Successfully"));
});



const getWatchHistory=asyncHandler(async(req,res)=>{
  
  const user=await User.aggregate([
     {
      $match: {
        _id:new mongoose.Types.ObjectId(req.user._id)   // we can't directly match the id as id that we see get pass by mongoose so it make the id readable by deprecating objectId() like syntax and gives the id directly, hence here we are making use of mongoose to pass the id as the db required
              }
     },
     {
      $lookup:{
        from:'videos',
        localField:'watchHistory',
        foreignField:"_id",
        as:'watchHistory',
        // nesting pipline to get the user details 
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:'owner',
              pipeline:[
                {
                $project:{
                  fullname:1,
                  username:1,
                  avatar:1
                }
              }
            ]
            }
          },
          {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
        ]

      }
     }
  ])

  if(!user.length){
    throw ApiError(404,"No WatchHistory Exist")
  }

  return res.status(200).json(new ApiResponse(200,user[0].watchHistory,"WatchHistory retrieve Success"))
})


//just a temporary controller fro getting list of all users 
const getAlluser=asyncHandler(async(req,res)=>{
     const users= await User.find()
     if(!users){
      throw new ApiError(500,"SOMETHING WENT WRONG WHILE ACCESSING ALL USER")
     }
     return res.status(200).json(new ApiResponse(200,users,"ALL USERS"))
})
export {getAlluser,registerUser,getuser,logInUser,logOut,refreshAccessToken,changeCurrentPassword,updateavatar,getCurrentUser,getUserChannelProfile,getWatchHistory}