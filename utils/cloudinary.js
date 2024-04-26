import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import * as dotenv from 'dotenv'
dotenv.config()
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET

})

const uploadOncloudinary=async(localfilepath)=>{
    try {
        if(!localfilepath){
            return null
        }
        const response= await cloudinary.uploader.upload(localfilepath,{ resource_type:'auto'})  // here we are passing the path of the file stored in server temporarily and mentioning type as auto means cloudinary should automatically detect its type
        fs.unlinkSync(localfilepath)  // now we are unlinking file means deleting it from the server file system
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath)
        console.log(error)
        // return null
    }
}

export {uploadOncloudinary}