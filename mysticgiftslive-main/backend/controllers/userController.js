import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Generate affiliate code for the Creator
const generateAffiliateCode = (email) => (
    email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') +
    crypto.randomBytes(3).toString('hex')
);

// User login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User doesn't exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' });

        const accessToken = createAccessToken({ id: user._id });
        const refreshToken = createRefreshToken({ id: user._id });

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({ success: true, accessToken, role: user.role });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// User register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists" });

        if (!validator.isEmail(email)) return res.json({ success: false, message: "Please enter a valid email" });
        if (password.length < 8) return res.json({ success: false, message: "Please enter a strong password" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        });

        const accessToken = createAccessToken({ id: newUser._id });
        const refreshToken = createRefreshToken({ id: newUser._id });

        newUser.refreshToken = refreshToken;
        const user = await newUser.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, accessToken, role: 'user' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Creator register
const registerCreator = async (req, res) => {
    try {
        const { name, email, password, bio, socials, payoutEmail } = req.body;
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists" });

        if (!validator.isEmail(email)) return res.json({ success: false, message: "Please enter a valid email" });
        if (password.length < 8) return res.json({ success: false, message: "Please enter a strong password" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const affiliateCode = generateAffiliateCode(email);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role: 'creator',
            bio,
            socials,
            payoutEmail,
            affiliateCode
        });

        const user = await newUser.save();

        const accessToken = createAccessToken({ id: user._id });
        const refreshToken = createRefreshToken({ id: user._id });

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, accessToken, role: 'creator', affiliateCode });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Fetch current user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password -refreshToken');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true }
        ).select('-password -refreshToken');
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Fetch creator profile
const getCreatorProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password -refreshToken');
        if (!user || user.role !== 'creator') return res.status(404).json({ success: false, message: 'Creator not found' });
        res.json({ success: true, creator: user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update creator profile
const updateCreatorProfile = async (req, res) => {
    try {
        const { name, email, bio, socials, payoutEmail } = req.body;
        const user = await userModel.findById(req.user.id);
        if (!user || user.role !== 'creator') return res.status(404).json({ success: false, message: 'Creator not found' });

        user.name = name;
        user.email = email;
        user.bio = bio;
        user.socials = socials;
        user.payoutEmail = payoutEmail;
        await user.save();

        res.json({ success: true, creator: user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Validate affiliate code
const validateAffiliateCode = async (req, res) => {
    try {
        const { code } = req.body;
        const creator = await userModel.findOne({ affiliateCode: code });
        if (creator) {
            creator.stats.clicks += 1;
            await creator.save();
            res.json({ success: true, valid: true, discount: 10 });
        } else {
            res.json({ success: true, valid: false, message: "Invalid affiliate code" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ Google Authentication
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Credential not provided' });
    }
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email not provided by Google' });
    }

    // Check if user exists
    let user = await userModel.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = new userModel({
        name,
        email,
        googleId,
        profilePicture: picture,
        role: 'user',
        password: hashedPassword,
        isGoogleUser: true
      });
      await user.save();
      console.log('✅ New Google user created:', email);
    } else {
      // Update existing user with Google info
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = picture || user.profilePicture;
        user.isGoogleUser = true;
        await user.save();
        console.log('✅ Google account linked:', email);
      } else {
        console.log('✅ Google user logged in:', email);
      }
    }

    // Generate tokens
    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ 
      success: true, 
      accessToken, 
      role: user.role,
      isNewUser,
      message: isNewUser ? 'Account created successfully' : 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('❌ Google auth error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};

export {
    loginUser,
    registerUser,
    registerCreator,
    getUserProfile,
    updateUserProfile,
    getCreatorProfile,
    updateCreatorProfile,
    validateAffiliateCode,
    googleAuth
};