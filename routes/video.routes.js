import { Router } from "express";
import {DeletingVideo, getVideoById, publishVideo, updateVideoDetails,getVideoAsperSearch} from '../controller/video.controller.js'
import {upload} from '../middleware/multer.middleware.js'
import {verifyJWT} from '../middleware/auth.middleware.js'

const router=Router()

router.route('/upload').post(verifyJWT,upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },
    
]),publishVideo)

router.route('/:videoId').get(verifyJWT,getVideoById)
router.route('/update/:videoId').patch(verifyJWT,updateVideoDetails)
router.route('/delete').delete(verifyJWT,DeletingVideo)
router.route('').get(verifyJWT,getVideoAsperSearch)
export default router