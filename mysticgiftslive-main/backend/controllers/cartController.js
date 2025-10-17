import userModel from "../models/userModel.js"
import productModel from "../models/productModel.js"

const addToCart = async (req, res) => {
    try {
        const { itemId, quantity } = req.body; 
        const userId = req.user.id;
        const userData = await userModel.findById(userId);
        if (!userData) return res.json({ success: false, message: "User not found" });

        let cartData = userData.cartData || {};
        const product = await productModel.findById(itemId);
        if (!product) return res.json({ success: false, message: "Product not found" });

        if (cartData[itemId]) {
            cartData[itemId].quantity += quantity || 1;
        } else {
            cartData[itemId] = {
                id: itemId,
                name: product.name,
                price: product.finalPrice,
                quantity: quantity || 1,
                image: product.image?.[0] || ''
            };
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const updateCart = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const userId = req.user.id;
        const userData = await userModel.findById(userId);
        if (!userData) return res.json({ success: false, message: "User not found" });

        let cartData = userData.cartData || {};
        if (!cartData[itemId]) {
            // If item not in cart, add it with correct product info
            const product = await productModel.findById(itemId);
            if (!product) return res.json({ success: false, message: "Product not found" });
            cartData[itemId] = {
                id: itemId,
                name: product.name,
                price: product.finalPrice,
                quantity: quantity,
                image: product.image?.[0] || ''
            };
        } else {
            cartData[itemId].quantity = quantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const userData = await userModel.findById(userId);
        if (!userData) return res.json({ success: false, message: "User not found", cartData: {} });

        let cartData = userData.cartData || {};

        // Optionally, sync prices with latest product data
        for (const itemId in cartData) {
            const product = await productModel.findById(itemId);
            if (product) {
                cartData[itemId].price = product.finalPrice;
                cartData[itemId].name = product.name;
                cartData[itemId].image = product.image?.[0] || '';
            }
        }

        res.json({ success: true, cartData });
    } catch (error) {
        res.json({ success: false, message: error.message, cartData: {} });
    }
}

const mergeCart = async (req, res) => {
    const userId = req.user.id;
    const guestCart = req.body.cartData || {};

    try {
        const user = await userModel.findById(userId);
        let userCart = user.cartData || {};

        for (const itemId in guestCart) {
            if (userCart[itemId]) {
                userCart[itemId].quantity += guestCart[itemId].quantity;
            }
            else {
                userCart[itemId] = guestCart[itemId];
            }
        }

        user.cartData = userCart;
        await userModel.findByIdAndUpdate(userId, { cartData: userCart });
        res.json({ success: true, message: "Cart merged successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart, mergeCart }