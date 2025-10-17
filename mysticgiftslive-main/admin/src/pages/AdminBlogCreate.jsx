import { useState } from 'react'

const AdminBlogCreate = () => {
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    slug: '',
    publishDate: '',
    estimatedTimeToRead: '',
    keywords: '',
    content: ''
  })
  const [coverImage, setCoverImage] = useState(null) // File state
  const [imagePreview, setImagePreview] = useState('') // Preview URL
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Handle image selection
  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setCoverImage(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  // Frontend validation function
  const validateForm = () => {
    if (!form.title.trim()) return "Title is required"
    if (!form.shortDescription.trim()) return "Short Description is required"
    if (!coverImage) return "Cover image is required"
    if (!form.slug.trim()) return "Slug is required"
    if (!form.publishDate) return "Publish Date is required"
    if (isNaN(Date.parse(form.publishDate))) return "Publish Date is invalid"
    if (!form.estimatedTimeToRead.trim()) return "Estimated Time To Read is required"
    if (!form.content.trim()) return "Content is required"
    return null
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSuccess('')
    setError('')
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('shortDescription', form.shortDescription)
      formData.append('cover', coverImage) // Append image file
      formData.append('slug', form.slug)
      formData.append('publishDate', form.publishDate)
      formData.append('estimatedTimeToRead', form.estimatedTimeToRead)
      formData.append('keywords', form.keywords)
      formData.append('content', form.content)

      const res = await fetch('http://localhost:4000/api/blogs', {
        method: 'POST',
        body: formData // Send FormData (NO Content-Type header needed)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.message || 'Failed to create blog')
        setLoading(false)
        return
      }
      
      setSuccess('Blog created successfully!')
      
      // Reset form
      setForm({
        title: '',
        shortDescription: '',
        slug: '',
        publishDate: '',
        estimatedTimeToRead: '',
        keywords: '',
        content: ''
      })
      setCoverImage(null)
      setImagePreview('')
      
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Create Blog Post</h2>
      
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title<span className="text-red-500">*</span></label>
          <input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            placeholder="e.g. The Power of Meditation" 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Short Description<span className="text-red-500">*</span></label>
          <input 
            name="shortDescription" 
            value={form.shortDescription} 
            onChange={handleChange} 
            placeholder="e.g. Discover how meditation transforms your mind." 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>

        {/* IMAGE UPLOAD SECTION */}
        <div>
          <label className="block font-medium mb-1">Cover Image<span className="text-red-500">*</span></label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
            required
          />
          {imagePreview && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Slug (unique)<span className="text-red-500">*</span></label>
          <input 
            name="slug" 
            value={form.slug} 
            onChange={handleChange} 
            placeholder="e.g. power-of-meditation" 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Publish Date<span className="text-red-500">*</span></label>
          <input 
            name="publishDate" 
            value={form.publishDate} 
            onChange={handleChange} 
            type="date" 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Estimated Time To Read<span className="text-red-500">*</span></label>
          <input 
            name="estimatedTimeToRead" 
            value={form.estimatedTimeToRead} 
            onChange={handleChange} 
            placeholder="e.g. 5 min" 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Keywords</label>
          <input 
            name="keywords" 
            value={form.keywords} 
            onChange={handleChange} 
            placeholder="e.g. meditation, mindfulness, wellness" 
            className="w-full border p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Blog Content<span className="text-red-500">*</span></label>
          <textarea 
            name="content" 
            value={form.content} 
            onChange={handleChange} 
            placeholder="Write your blog content here..." 
            className="w-full border p-2 h-40 rounded" 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Create Blog'}
        </button>
      </form>
    </div>
  )
}

export default AdminBlogCreate