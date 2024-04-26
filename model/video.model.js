import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema=new mongoose.Schema({
    videofile:{  //cloudinary file url
        type:String,
        required:true
    },
    thumbnail:{  //cloudinary file url
        type:String,
        
    },
    owner:{   //person who uploaded the video
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,   // this info would be provided by the cloudinary when it stores the file
        
    },
    views:{
        type:Number,
        required:true,
        default:0
    },
    isPublished:{
        type:Boolean,
        required:true,
        default:true
    }



},{timestamps:true})
videoSchema.plugin(mongooseAggregatePaginate)   // this line allow us to write the complex queries
export const Video= mongoose.model('Video',videoSchema)