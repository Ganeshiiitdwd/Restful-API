import {verifyJWT} from '../middleware/auth.middleware.js'
import {addComment,deleteComment,getAllCommentsforVideo, updateComment} from '../controller/comment.controller.js'
import { Router } from 'express'


const router=Router()

router.route('/posting/:videoId').post(verifyJWT,addComment)
router.route('/:videoId').get(verifyJWT,getAllCommentsforVideo)
router.route('/update').patch(verifyJWT,updateComment)
router.route('/delete').delete(verifyJWT,deleteComment)
export default router