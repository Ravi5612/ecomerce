import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      await userModel.findByIdAndUpdate(decoded.id, { refreshToken: '' });
    } catch (e) {
    }
    res.clearCookie('refreshToken');
  }
  res.json({ success: true, message: 'Logged out' });
});

export default router;