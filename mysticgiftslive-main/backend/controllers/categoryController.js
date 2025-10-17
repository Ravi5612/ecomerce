import categoryModel from "../models/categoryModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl = "";

    // Handle image upload if file is present
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories"
      });
      imageUrl = result.secure_url;
      // Delete local file after upload
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete local file:", err);
      });
    } else {
      return res.json({ success: false, message: "Image is required" });
    }

    const exists = await categoryModel.findOne({ name });
    if (exists) {
      return res.json({ success: false, message: "Category already exists" });
    }
    const category = new categoryModel({ name, image: imageUrl });
    await category.save();
    res.json({ success: true, message: "Category added successfully", category });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const listCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.json({ success: true, categories });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeCategory = async (req, res) => {
 try {
    const { id } = req.body;
    await categoryModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Category removed successfully" });
 } catch (error) {
    res.json({ success: false, message: error.message });
 }
};