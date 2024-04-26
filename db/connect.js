import mongoose from "mongoose";

const connectDB=async(url)=>{
    try{
        mongoose.set('strictQuery',true)
        await mongoose.connect(url)
      console.log("CONNECTED TO DATABASE")
    }catch(err){
        console.log("DB connection ERROR: "+err)
        process.exit(1)  //it is nodejs variable. It mean end the process with the failure
    }
}

export default connectDB