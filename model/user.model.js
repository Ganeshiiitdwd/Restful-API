import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema= new mongoose.Schema({
     watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Video'

        }
     ],
     username:{
        type:String,
        required:true,
        unique:true,
        index:true  //this optimizes the search but result into space complexity to tradeoff

     },
     email:{
        type:String,
        required:true,
        unique:true
     },
     fullname:{
        type:String,
        required:true,
     },
     avatar:{  
        type:String,   //cloudinary url for the image
        required:true
     },
     coverImage:{
        type:String,
        required:true
     },
     password:{},
     refreshtoken:{}
},{timestamps:true})


userSchema.pre('save',async function (next){
     if(!this.isModified('password')) return next()
     this.password=await bcrypt.hash(this.password,10) 
} )

userSchema.methods.isPasswordCorrect=async function (password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.genereteAccessToken= function(){
   return jwt.sign({   //u could add any info from current db document user
      _id:this._id,
      username:this.username,
      email:this.email,
      fullname:this.fullname
   },process.env.ACCESS_TOKEN_SECRET,
   {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
   }) 
}

userSchema.methods.genereteRefreshToken=function (){
   return jwt.sign({
      _id:this._id
   },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)
}

export const User= mongoose.model('User',userSchema)