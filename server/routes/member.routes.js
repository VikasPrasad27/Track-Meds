import { Router } from "express";
import { createMember, getAllMembers } from "../controllers/member.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/addmember').post(verifyJWT,createMember)

router.route('/getmember').get(verifyJWT,getAllMembers)

export default router;