import mongoose from "mongoose";

const TodoSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

export const Todo=mongoose.model('Todo',TodoSchema)