import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verificationCode: { type: String },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { minimize: false });

const adminModel = mongoose.models.admin || mongoose.model('admin', adminSchema);
export default adminModel;