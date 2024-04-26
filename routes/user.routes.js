import { Router } from "express";
import { registerUser ,getuser,logInUser,logOut,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateavatar, getUserChannelProfile,getWatchHistory, getAlluser} from "../controller/user.controller.js";
import {upload} from '../middleware/multer.middleware.js'
import {verifyJWT} from '../middleware/auth.middleware.js'
const router=Router()
// upload middleware justifying the name of files and how much it could be
router.route('/register').post(upload.fields([{name:'avatar',maxCount:1},{name:'coverImage',maxCount:1}]),registerUser)
router.route('/').get(verifyJWT,getuser)
router.route('/login').post(logInUser)
router.route('/logOut').post(verifyJWT,logOut)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/getcurrUser').get(verifyJWT,getCurrentUser)
// adding multer as we are using files here
router.route('/update-avatar').post(verifyJWT,upload.single('avatar'),updateavatar)
router.route('/update-password').post(verifyJWT,changeCurrentPassword)
router.route('/c/:username').get(verifyJWT,getUserChannelProfile)
router.route('/history').get(verifyJWT,getWatchHistory)

// temp
router.route('/all').get(getAlluser)
export default router