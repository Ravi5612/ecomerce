import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import adminModel from '../models/adminModel.js'
import adminAuth from '../middleware/adminAuth.js'
import userModel from '../models/userModel.js'
import nodemailer from 'nodemailer'
import { createAccessToken, createRefreshToken } from '../utils/jwt.js'

const adminRouter = express.Router()

// Helper: Send verification email
const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: 'Admin Account Verification - MysticGifts',
    html: `<h3>Your verification code: <b>${code}</b></h3>`
  })
}

adminRouter.delete('/delete-all-admins', async (req, res) => {
  try {
    const result = await adminModel.deleteMany({})
    res.json({ success: true, deleted: result.deletedCount })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

// 0. Check if setup is needed
adminRouter.get('/setup-needed', async (req, res) => {
  const adminCount = await adminModel.countDocuments()
  console.log(`Admin count: ${adminCount}`)
  res.json({ setupNeeded: adminCount === 0 })
})

// 1. Setup route (only if no admin exists)
adminRouter.post('/setup', async (req, res) => {
  try {
    console.log('SETUP BODY:', req.body)
    const adminCount = await adminModel.countDocuments()
    if (adminCount > 0) return res.json({ success: false, message: "Setup already completed" })

    const { name, email, password } = req.body
    if (!name || !email || !password) return res.json({ success: false, message: "All fields required" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const admin = new adminModel({ name, email, password: hashedPassword, verificationCode })
    await admin.save()
    // await sendVerificationEmail(email, verificationCode)
    console.log('ADMIN CREATED:', admin)
    res.json({ success: true, message: "Admin created. Check your email for verification code." })
  } catch (error) {
    console.error('SETUP ERROR:', error)
    res.json({ success: false, message: error.message })
  }
})

// 2. Verify email
adminRouter.post('/verify', async (req, res) => {
  try {
    console.log('VERIFY BODY:', req.body)
    const { email, code } = req.body
    const admin = await adminModel.findOne({ email })
    if (!admin) return res.json({ success: false, message: "Admin not found" })
    if (admin.verified) return res.json({ success: false, message: "Already verified" })
    if (admin.verificationCode !== code) return res.json({ success: false, message: "Invalid code" })

    admin.verified = true
    admin.verificationCode = undefined
    await admin.save()
    console.log('ADMIN VERIFIED:', admin)
    res.json({ success: true, message: "Email verified. You can now log in." })
  } catch (error) {
    console.error('VERIFY ERROR:', error)
    res.json({ success: false, message: error.message })
  }
})

// 3. Admin login
adminRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await adminModel.findOne({ email })
    if (!admin) return res.json({ success: false, message: "Admin not found" })
    if (!admin.verified) return res.json({ success: false, message: "Email not verified" })

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" })

    const accessToken = createAccessToken({ id: admin._id, role: 'admin' })
    const refreshToken = createRefreshToken({ id: admin._id, role: 'admin' })

    // Save refresh token in DB
    admin.refreshToken = refreshToken
    await admin.save()

    // Set refresh token as httpOnly cookie
    res.cookie('adminRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.json({
      success: true,
      accessToken,
      admin: { name: admin.name, email: admin.email }
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
})

// 4. Admin Refresh Token
adminRouter.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies.adminRefreshToken
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const admin = await adminModel.findById(decoded.id)
    if (!admin || admin.refreshToken !== token) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token' })
    }

    const newAccessToken = createAccessToken({ id: admin._id, role: 'admin' })
    res.status(200).json({ success: true, accessToken: newAccessToken })
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired refresh token' })
  }
})

// 5. Admin Logout
adminRouter.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.adminRefreshToken
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      const admin = await adminModel.findById(decoded.id)
      if (admin) {
        admin.refreshToken = null
        await admin.save()
      }
    }
    res.clearCookie('adminRefreshToken')
    res.json({ success: true, message: 'Logged out' })
  } catch (err) {
    res.clearCookie('adminRefreshToken')
    res.json({ success: true, message: 'Logged out' })
  }
})

// 6. Get current admin profile
adminRouter.get('/me', adminAuth, async (req, res) => {
  try {
    const admin = await adminModel.findById(req.admin._id).select('-password -refreshToken -verificationCode')
    if (!admin) return res.json({ success: false, message: "Admin not found" })
    res.json({ success: true, admin })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

// 7. Update admin profile
adminRouter.post('/update', adminAuth, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body
    const admin = await adminModel.findById(req.admin._id)
    if (!admin) return res.json({ success: false, message: "Admin not found" })

    if (name) admin.name = name
    if (email) admin.email = email

    if (newPassword) {
      if (!currentPassword) return res.json({ success: false, message: "Current password required" })
      const isMatch = await bcrypt.compare(currentPassword, admin.password)
      if (!isMatch) return res.json({ success: false, message: "Current password incorrect" })
      admin.password = await bcrypt.hash(newPassword, 10)
    }

    await admin.save()
    const updated = await adminModel.findById(admin._id).select('-password -refreshToken -verificationCode')
    res.json({ success: true, admin: updated })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

// 8. Get all creators and their stats
adminRouter.get('/creators', adminAuth, async (req, res) => {
  try {
    const creators = await userModel.find({ role: 'creator' })
      .select('name email affiliateCode bio socials payoutEmail stats')
    res.json({ success: true, creators })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
})

export default adminRouter