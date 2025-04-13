import express from 'express'
import {signin, signup ,signout, sendVerificationCode} from '../Controllers/authController.js'

const router = express.Router();

router.post('/signup',signup );
router.post('/signin',signin);
router.post('/signout',signout);
router.patch('/send-verification-code',sendVerificationCode);
export default router;
