import jwt from 'jsonwebtoken';

export const createAccessToken = (payload) => 
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

export const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });