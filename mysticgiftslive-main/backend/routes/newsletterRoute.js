import express from 'express'
import newsletterModel from '../models/newsletterModel.js'
import adminAuth from '../middleware/adminAuth.js'

const newsletterRouter = express.Router()

// Subscribe to newsletter (public route)
newsletterRouter.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.json({ success: false, message: "Email is required" })
        }

        // Check if email already exists
        const existingSubscriber = await newsletterModel.findOne({ email })
        
        if (existingSubscriber) {
            return res.json({ success: false, message: "Email already subscribed" })
        }

        // Create new subscriber
        const newSubscriber = new newsletterModel({
            email,
            subscribedAt: new Date()
        })

        await newSubscriber.save()

        res.json({ success: true, message: "Successfully subscribed to newsletter" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
})

// Get all subscribers (admin only)
newsletterRouter.get('/subscribers', adminAuth, async (req, res) => {
    try {
        const subscribers = await newsletterModel.find({}).sort({ subscribedAt: -1 })
        res.json({ success: true, subscribers })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
})

// Delete subscriber (admin only)
newsletterRouter.delete('/subscribers/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params
        
        const deletedSubscriber = await newsletterModel.findByIdAndDelete(id)
        
        if (!deletedSubscriber) {
            return res.json({ success: false, message: "Subscriber not found" })
        }
        
        res.json({ success: true, message: "Subscriber removed successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
})

export default newsletterRouter