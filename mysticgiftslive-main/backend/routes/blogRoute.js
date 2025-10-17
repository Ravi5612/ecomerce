import express from 'express'
import upload from '../middleware/upload.js' // ← ADD THIS
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js'

const router = express.Router()

router.post('/', upload.single('cover'), createBlog) // ← UPDATED
router.get('/', getBlogs)
router.get('/slug/:slug', getBlogBySlug)
router.get('/:id', getBlogById)
router.patch('/:id', upload.single('cover'), updateBlog) // ← UPDATED
router.delete('/:id', deleteBlog)

export default router