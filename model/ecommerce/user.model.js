import mongoose from "mongoose";

// u can write this stuff directly inside the orderitem as well 
const orderItemSchema= new mongoose.Schema({
    productId:{
        type:String,
        ref:'Product'
    },
    quantity:{
        type:Number,
        required:true
    }
})

const UserSchema= new mongoose.Schema({
    gender:{
        type:String,
        enum:["M","F"],
        required:true
    },
    orderitem:[orderItemSchema]
})

export const User= mongoose.model('User',UserSchema)