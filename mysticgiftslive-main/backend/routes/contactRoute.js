import express from 'express'
import { submitContact, getContactMessages, markAsRead, deleteContactMessage } from '../controllers/contactController.js'
import adminAuth from '../middleware/adminAuth.js'

const contactRouter = express.Router()

// Public route
contactRouter.post('/submit', submitContact)

// Admin routes (protected)
contactRouter.get('/messages', adminAuth, getContactMessages)
contactRouter.post('/mark-read', adminAuth, markAsRead)
contactRouter.post('/delete', adminAuth, deleteContactMessage)

export default contactRouter