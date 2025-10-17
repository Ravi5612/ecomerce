import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'
import productModel from "../models/productModel.js";
// global variables
const currency = 'AUD'

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Track processed sessions to prevent duplicates
const processedSessions = new Set();

// Clean up processed sessions every hour to prevent memory leaks
setInterval(() => {
    processedSessions.clear();
    console.log('Cleared processed sessions cache');
}, 60 * 60 * 1000); // 1 hour

// Middleware to extract user ID from request
function extractUserId(req) {
    let token = req.headers.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    console.log('Extracting userId from token:', token ? 'Token present' : 'No token');
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded user ID:', decoded.id);
            return decoded.id;
        } catch (err) {
            console.error('Token verification failed:', err.message);
            return null;
        }
    }
    return null;
}

// Stripe Session
const createStripeSession = async (req, res) => {
    try {
        const { amount, items, address, affiliateCode } = req.body;
        const origin = req.headers.origin || process.env.FRONTEND_URL;
        const userId = extractUserId(req);

        console.log('Creating Stripe session for userId:', userId || 'guest');

        // Single line item for the final total
        const line_items = [{
            price_data: {
                currency: currency,
                product_data: { name: 'Order Total' },
                unit_amount: Math.round(amount * 100)
            },
            quantity: 1
        }];    

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/order-placed?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/place-order?cancel=true`,
            line_items,
            mode: 'payment',
            metadata: {
                address: JSON.stringify(address),
                items: JSON.stringify(items),
                amount: amount.toString(),
                affiliateCode: affiliateCode || '',
                userId: userId || 'guest'
            }
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error('Stripe session creation error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Confirming Stripe Order
const confirmStripeOrder = async (req, res) => {
    try {
        const { session_id } = req.body;
        
        console.log('=== ORDER CONFIRMATION START ===');
        console.log('Session ID:', session_id);
        console.log('Request headers token:', req.headers.token ? 'Present' : 'None');
        
        // Check if this session was already processed
        if (processedSessions.has(session_id)) {
            console.log('Session already processed:', session_id);
            return res.json({ success: false, message: "Order already processed" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            // Check if order already exists for this session
            const existingOrder = await orderModel.findOne({ stripeSessionId: session.id });
            if (existingOrder) {
                console.log('Order already exists for session:', session.id);
                return res.json({ success: true, order: existingOrder });
            }

            const address = JSON.parse(session.metadata.address);
            const items = JSON.parse(session.metadata.items);
            const amount = parseFloat(session.metadata.amount);
            const affiliateCode = session.metadata.affiliateCode;
            const sessionUserId = session.metadata.userId;

            console.log('Session metadata userId:', sessionUserId);

            // Extract user ID from current request token (this should be the logged-in user)
            const currentUserId = extractUserId(req);
            console.log('Current request userId:', currentUserId);

            // Prioritize current request user ID, fallback to session metadata
            let finalUserId = null;
            if (currentUserId && currentUserId !== 'guest') {
                finalUserId = currentUserId;
                console.log('Using current request user ID:', finalUserId);
            } else if (sessionUserId && sessionUserId !== 'guest') {
                finalUserId = sessionUserId;
                console.log('Using session metadata user ID:', finalUserId);
            } else {
                console.log('No valid user ID found, creating guest order');
            }

            if (affiliateCode) {
                const creator = await userModel.findOne({ affiliateCode: affiliateCode });
                if (creator) {
                    creator.stats.sales += 1;
                    creator.stats.earnings += 10; // or your commission logic
                    await creator.save();
                }
            }

            console.log('Final userId for order:', finalUserId || 'guest');

            const orderData = {
                userId: finalUserId,
                items,
                address,
                amount,
                paymentMethod: "Stripe",
                payment: true,
                date: Date.now(),
                stripeSessionId: session.id,
                paymentIntentId: session.payment_intent
            };

            console.log('Creating order with data:', {
                userId: orderData.userId,
                itemsCount: orderData.items.length,
                amount: orderData.amount,
                userEmail: orderData.address.email
            });

            const newOrder = new orderModel(orderData);
            await newOrder.save();

            // Decrement inventory for each product
            for (const item of items) {
                await productModel.findByIdAndUpdate(
                    item.id || item._id,
                    { $inc: { inventory: -item.quantity } }
                );
            }

            // Mark session as processed
            processedSessions.add(session_id);

            console.log('Order created successfully:', newOrder._id, 'for user:', finalUserId || 'guest');

            // Clear cart for logged-in users
            if (finalUserId) {
                try {
                    const updateResult = await userModel.findByIdAndUpdate(finalUserId, { cartData: {} });
                    console.log('Cart cleared for user:', finalUserId, 'Update result:', updateResult ? 'Success' : 'Failed');
                } catch (cartError) {
                    console.error('Error clearing cart:', cartError);
                }
            }

            console.log('=== ORDER CONFIRMATION END ===');
            res.json({ success: true, order: newOrder });
        } else {
            res.json({ success: false, message: "Payment not completed" });
        }
    } catch (error) {
        console.error('Order confirmation error:', error);
        res.json({ success: false, message: error.message });
    }
};

// All Orders data for Admin Panel
const allOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// User Order Data For Frontend
const userOrders = async (req,res) => {
    try {
        const userId = req.user.id;
        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Add tracking URL
const updateTracking = async (req, res) => {
    try {
        const { orderId, trackingUrl } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { trackingUrl });
        res.json({ success: true, message: 'Tracking URL updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add invoice URL
const updateInvoice = async (req, res) => {
    try {
        const { orderId, invoiceUrl } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { invoiceUrl });
        res.json({ success: true, message: 'Invoice URL updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { createStripeSession, confirmStripeOrder, allOrders, userOrders, updateStatus, updateInvoice, updateTracking }