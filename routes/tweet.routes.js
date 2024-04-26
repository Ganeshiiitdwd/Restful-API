import { Router } from "express";
import {TweetDeleting, TweetPosting,TweetUpdate, getUserTweet} from '../controller/tweet.controller.js'
import {verifyJWT} from '../middleware/auth.middleware.js'

const router=Router()

router.route('/posting').post(verifyJWT,TweetPosting)
router.route('/:id').post(verifyJWT,TweetDeleting)
router.route('/:updateid').patch(verifyJWT,TweetUpdate)
router.route('/').get(verifyJWT,getUserTweet)
export default router;