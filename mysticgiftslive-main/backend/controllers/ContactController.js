import contactModel from '../models/contactModel.js'
import nodemailer from 'nodemailer'

const submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body

    const contactMessage = new contactModel({
      firstName, lastName, email, phone, message
    })

    await contactMessage.save()

    // Send email notification
    try {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      })

      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Contact Form - MysticGifts',
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
      })
    } catch (emailError) {
      console.log('Email error:', emailError)
    }

    res.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const getContactMessages = async (req, res) => {
  try {
    const messages = await contactModel.find({}).sort({ createdAt: -1 })
    res.json({ success: true, messages })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// ADD THESE MISSING FUNCTIONS:
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.body
    await contactModel.findByIdAndUpdate(messageId, { status: 'read' })
    res.json({ success: true, message: 'Message marked as read' })
  } catch (error) {
    console.error('Mark as read error:', error)
    res.json({ success: false, message: error.message })
  }
}

const deleteContactMessage = async (req, res) => {
  try {
    const { messageId } = req.body
    await contactModel.findByIdAndDelete(messageId)
    res.json({ success: true, message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Delete message error:', error)
    res.json({ success: false, message: error.message })
  }
}

// UPDATE EXPORT:
export { submitContact, getContactMessages, markAsRead, deleteContactMessage }