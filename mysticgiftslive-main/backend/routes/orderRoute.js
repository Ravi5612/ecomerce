import express from 'express'
import {createStripeSession, confirmStripeOrder, allOrders, userOrders, updateStatus, updateInvoice, updateTracking} from '../controllers/orderController.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/tracking', adminAuth, updateTracking)
orderRouter.post('/invoice', adminAuth, updateInvoice)

// Payment Features
// orderRouter.post('/place',placeOrder)
// orderRouter.post('/stripe',placeOrderStripe)
// orderRouter.post('/razorpay',authUser,placeOrderRazorpay)
orderRouter.post('/createStripeSession', createStripeSession);
orderRouter.post('/confirmStripeOrder', confirmStripeOrder);

// User Feature
orderRouter.post('/userorders', authUser, userOrders)

// verify payment
// orderRouter.post('/verifyStripe', verifyStripe)
export default orderRouter