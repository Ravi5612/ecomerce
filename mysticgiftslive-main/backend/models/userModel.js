import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    refreshToken: { type: String },
    role: { type: String, enum: [ 'user', 'creator' ], default: 'user' },
    
    // ✅ Google OAuth fields - ADD THESE
    googleId: { type: String, unique: true, sparse: true },
    profilePicture: { type: String },
    isGoogleUser: { type: Boolean, default: false },
    
    // Creator specific fields
    bio: { type: String },
    socials: { type: String },
    payoutEmail: { type: String },
    affiliateCode: { type: String, unique: true, sparse: true },
    stats: {
        clicks: { type: Number, default: 0 },
        earnings: { type: Number, default: 0 },
        sales: { type: Number, default: 0 }
    }
}, { minimize: false, timestamps: true })

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel