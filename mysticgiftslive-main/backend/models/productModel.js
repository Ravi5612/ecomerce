import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    tags: { type: Array, default: [] },
    // subCategory: { type: String },
    // sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    premium: { type: Boolean, default: false },
    date: { type: Number, required: true },
    inventory: { type: Number, required: true, default: 0 }
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel