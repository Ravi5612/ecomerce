import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  cover: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  publishDate: { type: Date, required: true },
  estimatedTimeToRead: { type: String, required: true },
  keywords: { type: String },
  content: { type: String, required: true },
  published: { type: Boolean, default: false } 
}, { timestamps: true })

export default mongoose.model('Blog', blogSchema)