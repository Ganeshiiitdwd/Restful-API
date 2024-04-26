import mongoose from "mongoose";
const SubscribeSchema= new mongoose.Schema({
    subscribe:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

export const Subscribe= mongoose.model("Subscription",SubscribeSchema)