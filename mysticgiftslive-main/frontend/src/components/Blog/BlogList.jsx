import React from 'react'

const BlogList = ({ posts, type = 'vertical', onPostClick }) => {
  if (type === 'horizontal') {
    return (
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div 
            key={index} 
            className="flex gap-6 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onPostClick(post)}
          >
            <img
              src={post.cover}
              alt={post.title}
              className="w-48 h-32 object-cover"
            />
            <div className="flex-1 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-purple-600">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {post.shortDescription}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                <span>{post.estimatedTimeToRead}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <div 
          key={index} 
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onPostClick(post)}
        >
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600">
              {post.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {post.shortDescription}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{new Date(post.publishDate).toLocaleDateString()}</span>
              <span>{post.estimatedTimeToRead}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogList