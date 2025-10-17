import jwt from 'jsonwebtoken'
import adminModel from '../models/adminModel.js'

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: "Not authorized" })
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const admin = await adminModel.findById(decoded.id)
    if (!admin || !admin.verified) {
      return res.status(401).json({ success: false, message: "Not authorized" })
    }
    req.admin = admin
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: "Not authorized" })
  }
}

export default adminAuth