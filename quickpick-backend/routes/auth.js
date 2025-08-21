import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from '../nodemailer.js';
import crypto from 'crypto';
import User from '../models/User.js';

const router = express.Router();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer configuration error:', error);
  } else {
    console.log('Nodemailer is ready to send emails');
  }
});

// Temporary storage for OTPs and reset tokens (use Redis in production)
const otpStore = new Map();

// Signup: Send OTP
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, password, expires: Date.now() + 600000 });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Account',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Verify OTP and create user
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    const user = new User({ email, password: stored.password, isVerified: true });
    await user.save();
    otpStore.delete(email);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (!(await user.comparePassword(password))) return res.status(400).json({ msg: 'Invalid password' });
    if (!user.isVerified) return res.status(400).json({ msg: 'Account not verified' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Forgot Password: Send OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expires: Date.now() + 600000 });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Verify OTP for Password Reset
router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    otpStore.set(resetToken, { email, expires: Date.now() + 3600000 });
    otpStore.delete(email);

    res.json({ msg: 'OTP verified', resetToken });
  } catch (err) {
    console.error('Verify reset OTP error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const stored = otpStore.get(resetToken);
    if (!stored || stored.expires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired reset token' });
    }

    const user = await User.findOne({ email: stored.email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    user.password = newPassword;
    user.isVerified = true;
    await user.save();
    otpStore.delete(resetToken);

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

export default router;
