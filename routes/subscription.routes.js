import { Router } from "express";
import { getListofChannelSubscribed, getListofSUbscriber, toggleSubscription} from "../controller/subscription.controller.js";

import {verifyJWT} from '../middleware/auth.middleware.js'
const router=Router()

router.route('/sub/:channelId').post(verifyJWT,toggleSubscription)
router.route('/ch/:channelId').get(verifyJWT,getListofSUbscriber)
router.route('/c/:subscriberId').get(verifyJWT,getListofChannelSubscribed)
export default router