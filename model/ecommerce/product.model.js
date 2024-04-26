import mongoose from "mongoose";

const ProductSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    }
})

export const Product= mongoose.model('Product',ProductSchema)