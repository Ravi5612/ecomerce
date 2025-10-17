import express from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { createAccessToken } from '../utils/jwt.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }

    const newAccessToken = createAccessToken({ id: user._id });
    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

export default router;