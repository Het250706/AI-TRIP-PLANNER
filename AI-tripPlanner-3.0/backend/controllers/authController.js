import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import User from '../models/user-model.js';
import OTP from '../models/otp-model.js';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// @desc    Send OTP to email
// @route   POST /auth/send-otp
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        // Send Email
        const { data, error } = await resend.emails.send({
            from: 'Trip Planner <onboarding@resend.dev>',
            to: email,
            subject: 'Your Verification Code - AI Trip Planner',
            html: `<h1>Your verification code is: <b>${otp}</b></h1><p>This code expires in 5 minutes.</p>`
        });

        if (error) {
            console.error("Resend Error:", error);
            // If it's a "not verified" error, we can still return the OTP for testing purposes if in development
            if (process.env.NODE_ENV === 'development') {
                return res.status(200).json({
                    success: true,
                    message: '(DEV MODE) OTP generated but email failed to send. OTP: ' + otp,
                    otp: otp
                });
            }
            return res.status(500).json({ success: false, message: 'Failed to send OTP email', error: error.message });
        }

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc    Register a new user
// @route   POST /auth/register
export const register = async (req, res) => {
    try {
        const { fullname, email, password, otp } = req.body;

        if (!fullname || !email || !password || !otp) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Verify OTP
        const storedOtp = await OTP.findOne({ email, otp });
        if (!storedOtp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Check if user already exists (double check)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword
        });

        // Clean up OTP
        await OTP.deleteOne({ email });

        // Generate Token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET || 'highhook',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc    Login user
// @route   POST /auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'highhook',
            { expiresIn: '7d' }
        );

        // Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                picture: user.picture
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc    Logout user
// @route   POST /auth/logout
export const logout = async (req, res) => {
    res.cookie('token', '', { expires: new Date(0) });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id || req.user._id).select('-password');
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get Me Error:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
