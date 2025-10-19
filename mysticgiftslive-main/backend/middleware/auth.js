import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
    let token = req.headers.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ✅ Fetch user from database
        const user = await userModel.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // ✅ Check if 1 hour has passed since last activity
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        if (user.lastActivity && user.lastActivity < oneHourAgo) {
            // Auto logout - clear refresh token
            user.refreshToken = null;
            await user.save();
            
            return res.status(401).json({ 
                success: false, 
                message: 'Session expired due to inactivity. Please login again.',
                expired: true 
            });
        }

        // ✅ Update last activity timestamp
        user.lastActivity = new Date();
        await user.save();

        req.user = { id: user._id };
        next();
    } catch (error) {
        console.log(error);
        
        // Handle JWT expiry separately
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired. Please login again.',
                expired: true 
            });
        }
        
        res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
}

export default authUser;