import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('http://localhost:4000/api/blogs')
        const data = await res.json()
        setBlogs(data)
      } catch (err) {
        setError('Failed to fetch blogs')
      }
      setLoading(false)
    }
    fetchBlogs()
  }, [success])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return
    try {
      const res = await fetch(`http://localhost:4000/api/blogs/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setSuccess('Blog deleted successfully!')
      setTimeout(() => setSuccess(''), 2000)
    } catch {
      setError('Failed to delete blog')
    }
  }

  const handleTogglePublish = async (id, published) => {
    try {
      const res = await fetch(`http://localhost:4000/api/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published })
      })
      if (!res.ok) throw new Error('Failed to update publish status')
      setSuccess('Blog status updated!')
      setTimeout(() => setSuccess(''), 2000)
    } catch {
      setError('Failed to update publish status')
    }
  }

  return (     
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">All Blogs</h2>
        <Link
          to="/blog/create"
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition whitespace-nowrap"
        >
          <img src={assets.add_icon} alt="" className="w-5 h-5" />
          <span>Create Blog</span>
        </Link>
      </div>
      
      {success && <div className="mb-4 text-green-600">{success}</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-[600px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Slug</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Published</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {blogs.map((blog, idx) => (
                  <tr key={blog._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2 max-w-[200px] truncate">{blog.title}</td>
                    <td className="px-4 py-2 max-w-[150px] truncate font-mono text-sm">{blog.slug}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${blog.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {blog.published ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400">No blogs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBlogList