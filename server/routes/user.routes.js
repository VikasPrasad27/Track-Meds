import { Router } from "express";
import { logoutUser, loginUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name:"profileimg",
            maxCount:1
        }
    ]),
    registerUser
);
router.route('/login').post(loginUser)

router.route('/logout').post(verifyJWT, logoutUser)

router.route('/refresh-token').post(refreshAccessToken)

router.get("/auth/check", verifyJWT, (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});

export default router;