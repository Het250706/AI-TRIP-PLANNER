import express from 'express';
import { login, register, sendOTP, logout, getMe } from '../controllers/authController.js';
import isLoggedIn from '../middlewares/isloggedin.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', isLoggedIn, getMe);

export default router;
