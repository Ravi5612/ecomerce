import React from 'react'
import { formatDate } from '../../lib/utils'

const BlogCard = ({ post }) => {
  const { title, shortDescription, cover, slug, publishDate, estimatedTimeToRead } = post

  return (
    <div
      key={slug}
      className="flex transform flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-transform hover:scale-105 hover:shadow-md">
      <figure className="relative h-40 w-full overflow-hidden rounded-md bg-gray-200">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={cover}
          alt={title || "Blog post image"}
        />
      </figure>

      <a href={`/${slug}`} className="block">
        <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-200 hover:text-blue-600">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{shortDescription}</p>
        <p className="text-xs font-medium text-gray-500">
          {formatDate(publishDate)} | {estimatedTimeToRead}
        </p>
      </a>
    </div>
  )
}

export default BlogCard