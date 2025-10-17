import React from 'react'
import { formatDate } from '../../lib/utils'

const BlogCard = ({ post }) => {
  const { title, shortDescription, cover, slug, publishDate, estimatedTimeToRead } = post

  return (
    <div key={slug} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm lg:flex-row hover:shadow-md transition-shadow">
      <figure className="relative mt-1 h-24 min-w-40 overflow-hidden rounded-md bg-gray-200 lg:h-32">
        <img
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          src={cover}
          alt={title || "Blog post image"}
        />
      </figure>

      <a href={`/${slug}`} className="flex-1">
        <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-200 hover:text-blue-600">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{shortDescription}</p>
        <p className="text-xs font-medium text-gray-500">
          {formatDate(publishDate)} | {estimatedTimeToRead}
        </p>
      </a>
    </div>
  )
}

export default BlogCard