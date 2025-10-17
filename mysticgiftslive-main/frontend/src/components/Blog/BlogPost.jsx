import React from 'react'
import { useNavigate } from 'react-router-dom'

const BlogPost = ({ post, onBack }) => {
  const navigate = useNavigate()

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Blog Post Found</h2>
        <button
          onClick={onBack}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          ← Back to Blog
        </button>
      </div>
    )
  }

  const {
    title = 'Untitled Post',
    cover = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    shortDescription = 'A spiritual journey of discovery and wisdom.',
    publishDate = new Date().toISOString(),
    estimatedTimeToRead = '5 min read',
    keywords = 'spirituality, wellness, mindfulness',
    content = ''
  } = post

  const handleShopClick = () => {
    navigate('/collection')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 transition-colors"
      >
        ← Back to Blog
      </button>

      {/* Hero Image */}
      <div className="mb-8">
        <img
          src={cover}
          alt={title}
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
          }}
        />
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            📅 {new Date(publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="flex items-center gap-1">
            ⏱️ {estimatedTimeToRead}
          </div>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          {shortDescription}
        </p>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-gray-500">🏷️</span>
          <div className="flex flex-wrap gap-2">
            {keywords.split(',').map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
              >
                {keyword.trim()}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Article Content - FIXED */}
      <article className="prose prose-lg max-w-none mb-12">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </article>

      {/* Call to Action */}
      <div className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          🛍️ Explore Our Authentic Indian Collection
        </h3>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Discover genuine Indian gifts, traditional Indian home decor, authentic Indian antiques, and wellness products.
        </p>
        <button
          onClick={handleShopClick}
          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
        >
          🛍️ Shop Mystic Gifts
        </button>
      </div>

      {/* Share Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h4>
        <div className="flex gap-4 flex-wrap">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            📘 Facebook
          </button>
          <button className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors">
            🐦 Twitter
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            📱 WhatsApp
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            📌 Pinterest
          </button>
        </div>
      </div>

      {/* Related Topics */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h4>
        <div className="flex flex-wrap gap-2">
          {[
            'Copper Benefits',
            'Ayurvedic Wellness',
            'Indian Decor',
            'Spiritual Gifts',
            'Traditional Crafts',
            'Meditation Tools'
          ].map((topic, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogPost