import Blog from '../models/blogModel.js'

// Create a new blog with Cloudinary image
export const createBlog = async (req, res) => {
  try {
    const blogData = req.body
    
    // If image uploaded to Cloudinary, use its URL
    if (req.file) {
      blogData.cover = req.file.path // Cloudinary URL
    }
    
    const blog = new Blog(blogData)
    await blog.save()
    res.status(201).json(blog)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Update blog with Cloudinary image
export const updateBlog = async (req, res) => {
  try {
    const blogData = req.body
    
    // If new image uploaded, update cover
    if (req.file) {
      blogData.cover = req.file.path // Cloudinary URL
    }
    
    const blog = await Blog.findByIdAndUpdate(req.params.id, blogData, { new: true })
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json(blog)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Get all blogs (same as before)
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishDate: -1 })
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json({ message: 'Blog deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}