import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import fs from "fs"

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, originalPrice, finalPrice, category, tags, bestseller, premium, inventory } = req.body

        let images = [];
        if (req.files) {
            if (Array.isArray(req.files)) {
                images = req.files;
            } else {
                Object.values(req.files).forEach(arr => {
                    images = images.concat(arr);
                });
            }
        }

        // Upload all images to Cloudinary from disk and remove local files
        let imagesUrl = await Promise.all(
        images.map(async (item) => {
            let url = '';
            try {
            const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
            url = result.secure_url;
            } finally {
            fs.unlink(item.path, (err) => {
                if (err) console.error("Failed to delete local file:", err);
            });
            }
            return url;
        })
        );

        const productData = {
            name,
            description,
            category,
            originalPrice: Number(originalPrice),
            finalPrice: Number(finalPrice),
            tags: tags ? JSON.parse(tags) : [],
            bestseller: bestseller === "true" ? true : false,
            premium: premium === "true" ? true : false,
            image: imagesUrl,
            date: Date.now(),
            inventory: Number(inventory) || 0,
            // subCategory,
            // sizes: JSON.parse(sizes)
        }

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for editing product
const editProduct = async (req, res) => {
    try {
        const { _id, name, description, originalPrice, finalPrice, category, tags, bestseller, premium, image, inventory } = req.body;
        if (!_id) return res.json({ success: false, message: "Product ID required" });

        // Parse sizes if needed
        // const parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);

        // Handle new image uploads
        let newImagesUrl = [];
        let files = [];
        if (req.files) {
            if (Array.isArray(req.files)) {
                files = req.files;
            } else {
                Object.values(req.files).forEach(arr => {
                    files = files.concat(arr);
                });
            }
        }
        if (files.length > 0) {
            newImagesUrl = await Promise.all(
            files.map(async (item) => {
                let url = '';
                try {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                url = result.secure_url;
                } finally {
                fs.unlink(item.path, (err) => {
                    if (err) console.error("Failed to delete local file:", err);
                });
                }
                return url;
            })
            );
        }

        // Merge existing images (from req.body.image) and new ones
        let updatedImages = [];
        if (image && image !== "undefined" && image !== "") {
            try {
                updatedImages = Array.isArray(image) ? image : JSON.parse(image);
            } catch (err) {
                updatedImages = [];
            }
        }
        updatedImages = [...updatedImages, ...newImagesUrl];

        // Validate required fields
        if (
            !name || !description || !category || !inventory ||
            !originalPrice || !finalPrice || updatedImages.length === 0
        ) {
            return res.json({ success: false, message: "All required fields must be filled and at least one image must be present." });
        }

        // Prepare update object
        const update = {
            name,
            description,
            originalPrice: Number(originalPrice),
            finalPrice: Number(finalPrice),
            tags: tags && tags !== "undefined" && tags !== "" ? JSON.parse(tags) : [],
            category,
            // subCategory,
            // sizes: parsedSizes,
            bestseller: bestseller === "true" || bestseller === true,
            premium: premium === "true" || premium === true,
            image: updatedImages,
            inventory: Number(inventory) || 0,
        };

        await productModel.findByIdAndUpdate(_id, update);
        res.json({ success: true, message: "Product updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { listProducts, addProduct, removeProduct, singleProduct, editProduct }