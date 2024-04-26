import { Router } from "express";
import {AddVideoToPlaylist, createPlaylist, getUserplaylist, getplaylistbyId, removeVideoFromPlaylist} from '../controller/playlist.controller.js'
import {verifyJWT} from '../middleware/auth.middleware.js'

const router=Router()

router.route('/create').post(verifyJWT,createPlaylist)
router.route('/:userId').get(verifyJWT,getUserplaylist)
router.route('/p/:pid').get(verifyJWT,getplaylistbyId)
router.route('/add-video').patch(verifyJWT,AddVideoToPlaylist)
router.route('/remove-video').patch(verifyJWT,removeVideoFromPlaylist)
export default router