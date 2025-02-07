import express from 'express';
import { logIN, signOut, signUp } from '../controllers/userAuth.controller.js';
import verifyUserJWT from '../middlewares/auth.middleware.js';
const router = new express.Router();

router.route('/signUp').post(signUp);
router.route('/signOut').post(verifyUserJWT, signOut);
router.route('/login').post(logIN);

export default router;  