import express from 'express';
import {
    loginUser,
    registerUser,
    registerCreator,
    getUserProfile,
    updateUserProfile,
    getCreatorProfile,
    updateCreatorProfile,
    validateAffiliateCode,
    googleAuth  // ✅ Import Google auth
} from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/google-auth', googleAuth)  // ✅ Add Google auth route

// Creator signup
userRouter.post('/creator-register', registerCreator)
userRouter.post('/validate-affiliate', validateAffiliateCode)

// Profile routes
userRouter.get('/me', authUser, getUserProfile)
userRouter.post('/update', authUser, updateUserProfile)
userRouter.get('/creator/me', authUser, getCreatorProfile)
userRouter.post('/creator/update', authUser, updateCreatorProfile)

export default userRouter;