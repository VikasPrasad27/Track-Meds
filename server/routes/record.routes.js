import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from '../middlewares/multer.middleware.js'
import { addRecord, deleteRecord, getAllRecords, getRecordsByMember } from "../controllers/record.controller.js";

const router = Router()

router.route('/addrecord').post(upload.fields([
        {
            name:"reportUrl",
            maxCount:1
        }
]),verifyJWT,addRecord);

router.route("/getrecord").get(verifyJWT,getAllRecords)

router.route('/getrecordByMember').get(verifyJWT,getRecordsByMember);

router.route('/deleterecord').delete(verifyJWT,deleteRecord);

export default router;