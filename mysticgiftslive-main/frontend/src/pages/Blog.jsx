import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import BlogList from '../components/Blog/BlogList'
import SimpleBanner from '../components/Blog/SimpleBanner'
import BlogPost from '../components/Blog/BlogPost'
import { fetchBlogs } from '/src/api/blogApi'
import { Link } from 'react-router-dom'

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null)
  const [viewType, setViewType] = useState('vertical')
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs()
        setBlogPosts(data)
      } catch (err) {
        setError('Failed to load blogs')
      } finally {
        setLoading(false)
      }
    }
    getBlogs()
  }, [])

  // Handle post selection
  const handlePostClick = (post) => {
    console.log('Post clicked:', post) // Debug
    setSelectedPost(post)
    window.scrollTo(0, 0)
  }

  const handleBackToBlog = () => {
    setSelectedPost(null)
  }

  // Handle category click
  const handleCategoryClick = () => {
    navigate('/collection')
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" })
    }, 100)
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">Loading blogs...</div>
    </div>
  )
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-red-500">{error}</div>
    </div>
  )

  // If a post is selected, show the full post view
  if (selectedPost) {
    return (
      <div className='px-4 py-20 sm:px-6 lg:px-16'>
        <BlogPost post={selectedPost} onBack={handleBackToBlog} />
      </div>
    )
  }

  // Otherwise, show the blog list view
  return (
    <div className='px-4 py-20 sm:px-6 lg:px-16'>
      {/* Banner Section */}
      <SimpleBanner 
        title="MysticGifts Spiritual Blog"
        description="Discover wisdom, guidance, and inspiration for your spiritual journey through our collection of wellness articles"
      />

      {/* View Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewType('vertical')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewType === 'vertical'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewType('horizontal')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewType === 'horizontal'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List View
          </button>
        </div>
      </div>
  
      {/* Blog Posts Grid/List */}
      <BlogList posts={blogPosts} type={viewType} onPostClick={handlePostClick} />

      {/* Featured Categories */}
      <div className='my-20'>
        <div className='text-center mb-12'>
          <Title text1={'POPULAR'} text2={'CATEGORIES'} />
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          <div 
            className='text-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer'
            onClick={handleCategoryClick}
          >
            <div className='text-3xl mb-2'>🧿</div>
            <h3 className='font-semibold'>Copper Wellness</h3>
          </div>
          <div 
            className='text-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer'
            onClick={handleCategoryClick}
          >
            <div className='text-3xl mb-2'>🌬️</div>
            <h3 className='font-semibold'>Energy Flow</h3>
          </div>
          <div 
            className='text-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer'
            onClick={handleCategoryClick}
          >
            <div className='text-3xl mb-2'>🕉️</div>
            <h3 className='font-semibold'>Sacred Decor</h3>
          </div>
          <div 
            className='text-center p-6 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer'
            onClick={handleCategoryClick}
          >
            <div className='text-3xl mb-2'>✨</div>
            <h3 className='font-semibold'>Rituals</h3>
          </div>
        </div>
      </div>

      {/* Content Creator Call to Action */}
      <div className='mb-16'>
        <div className='bg-[linear-gradient(90deg,#a78bfa,#f472b6,#fde047)] rounded-xl p-8 md:p-12 text-center border border-white/30 shadow-2xl backdrop-blur-md'>
          <h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
            Join Our Content Creator Community
          </h3>
          <p className='text-lg text-gray-700 mb-6 max-w-3xl mx-auto'>
            Are you passionate about spiritual wellness, Ayurveda, or authentic Indian culture? 
            We're looking for content creators who share our mission of spreading authentic spiritual wisdom.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to="/creator-signup"
              className='bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-block'
            >
              Become a Creator
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog