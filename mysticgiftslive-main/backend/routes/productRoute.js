import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct, editProduct } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.any(), addProduct);
productRouter.post('/edit', adminAuth, upload.any(), editProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

export default productRouter