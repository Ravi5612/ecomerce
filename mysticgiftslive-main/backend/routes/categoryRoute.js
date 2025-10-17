import express from "express";
import { addCategory, listCategories, removeCategory } from '../controllers/categoryController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';
import { v2 as cloudinary } from 'cloudinary';
import categoryModel from '../models/categoryModel.js';
import fs from "fs";

const categoryRouter = express.Router();

// Routes
categoryRouter.post('/add', adminAuth, upload.single('image'), addCategory);
categoryRouter.get('/list', listCategories);
categoryRouter.post('/remove', adminAuth, removeCategory);
categoryRouter.post('/edit-image', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.body;
    if (!req.file) return res.json({ success: false, message: "No image uploaded" });
    const result = await cloudinary.uploader.upload(req.file.path, { folder: "categories" });
    // Delete local file after upload
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });
    await categoryModel.findByIdAndUpdate(id, { image: result.secure_url });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

export default categoryRouter;