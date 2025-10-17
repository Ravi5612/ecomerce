const SimpleBanner = ({ title, description }) => {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-4xl font-bold leading-tight text-gray-900 mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
        )}
      </div>
    </div>
  )
}

export default SimpleBanner