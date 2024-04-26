import mongoose from "mongoose";

const task=mongoose.Schema({
    name:{type:String},
    tick:{type:Boolean,default:false}
})

const taskmodel=mongoose.model('task',task)

export default taskmodel