import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default:'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true , default: false },
    date: {type: Number, required:true},
    stripeSessionId: { type: String, required: false },
    paymentIntentId: { type: String, required: false },
    trackingUrl: { type: String, required: false },
    invoiceUrl: { type: String, required: false }
})

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel;