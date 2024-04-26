import { Router } from 'express'
import {getAllVideoLike, toggleCommentLike, toggleTweetLike, toggleVideoLike} from '../controller/like.controller.js'
import {verifyJWT} from '../middleware/auth.middleware.js'


const router=Router()
router.route('/video/:videoId').post(verifyJWT,toggleVideoLike)
router.route('/comment/:commentId').post(verifyJWT,toggleCommentLike)
router.route('/tweet/:tweetId').post(verifyJWT,toggleTweetLike)
router.route('/video/').get(verifyJWT,getAllVideoLike)
export default router