import * as dotenv from 'dotenv'
import express from 'express'
import connectDB from './db/connect.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
const app=express()
// this origin specifies which https wedsites should be given access or say from where should we accept the request as in our local host it is localhost:3000
// setting up the key stuff for production # middlewares
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:'20kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))  //for urlencoded means things like space become 20% like this
app.use(express.static('public')) //it is used for keeping the files like pdf ,image any assets that a required like that 
app.use(cookieParser())

//practice

app.get('/',(req,res)=>{
    res.status(200).json({msg:'PLATA O PLOMO',default:true})
})
app.get('/api/v1',(req,res)=>{
    res.status(200).json({msg:'Hello World'})
})


// writing routes
import userRoute from './routes/user.routes.js'
import videoRoute from './routes/video.routes.js'
import tweetRoute from './routes/tweet.routes.js'
import commentRoute from './routes/comment.routes.js'
import likeRoute from './routes/like.routes.js'
import playlistRoute from './routes/playlist.routes.js'
import  subscriptionRoute from './routes/subscription.routes.js' 
app.use('/api/v1/user',userRoute)
app.use('/api/v1/video',videoRoute)
app.use('/api/v1/tweet',tweetRoute)
app.use('/api/v1/comment',commentRoute)
app.use('/api/v1/like', likeRoute)
app.use('/api/v1/playlist',playlistRoute)
app.use('/api/v1/subscription',subscriptionRoute)




// it is listening of server part

const start=async()=>{
    try{
        await connectDB(process.env.DB_CONNECT_URI)
        app.listen(process.env.PORT,()=>{
            console.log("Server is Live...!")
        })
    }catch(err){
        console.log(err)
    }
}

start()

