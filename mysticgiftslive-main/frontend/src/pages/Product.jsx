import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import RelatedProducts from '../components/RelatedProducts'
import LoadingButton from '../ui/LoadingButton'
import { toast } from 'react-toastify'

const VISIBLE_THUMBS = 3

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [thumbStart, setThumbStart] = useState(0)
  // Responsive: detect if mobile or laptop
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024) // mobile & tablet: <1024px
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const item = products.find((p) => p._id === productId)
    if (item) {
      setProductData(item)
      setImage(item.image?.[0] || '')
      setThumbStart(0)
    }
  }, [productId, products])

  if (!productData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <span className="text-gray-400 text-lg">Loading product...</span>
      </div>
    )
  }

  // New price logic
  const hasDiscount = Number(productData.originalPrice) > Number(productData.finalPrice);
  const discountPercent = hasDiscount
    ? Math.round(((productData.originalPrice - productData.finalPrice) / productData.originalPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await addToCart(productData._id, quantity, productData.finalPrice)
      toast.success('Added to cart!')
    } catch (e) {
      toast.error('Could not add to cart')
    }
    setLoading(false)
  }

  // Carousel logic
  const images = productData.image || []
  const showCarousel = images.length > 1

  // Navigation logic
  const canScrollPrev = thumbStart > 0
  const canScrollNext = thumbStart + VISIBLE_THUMBS < images.length

  // Handle navigation buttons
  const handlePrev = () => {
    // If current image is not the first visible thumbnail, just change image
    const currentIdx = images.indexOf(image);
    if (currentIdx > thumbStart) {
      setImage(images[currentIdx - 1]);
    } else if (canScrollPrev) {
      // Scroll thumbnails and set image to new first visible
      setThumbStart(thumbStart - 1);
      setImage(images[thumbStart - 1]);
    }
  };

  const handleNext = () => {
    const currentIdx = images.indexOf(image);
    // If current image is not the last visible thumbnail, just change image
    if (currentIdx < thumbStart + VISIBLE_THUMBS - 1 && currentIdx < images.length - 1) {
      setImage(images[currentIdx + 1]);
    } else if (canScrollNext) {
      // Scroll thumbnails and set image to new last visible
      setThumbStart(thumbStart + 1);
      setImage(images[thumbStart + VISIBLE_THUMBS]);
    }
  };

  // When clicking a thumbnail, set image and adjust thumbStart if needed
  const handleThumbClick = (img, idx) => {
    setImage(img);
    if (idx < thumbStart) setThumbStart(idx);
    if (idx >= thumbStart + VISIBLE_THUMBS) setThumbStart(idx - VISIBLE_THUMBS + 1);
  };

  return (
    <div className="w-full py-20 px-4 sm:px-6 lg:px-16">
      <div className="relative bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 py-16 px-4 md:px-8">
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
  </div>

  <div className="relative max-w-4xl mx-auto text-center">
    {/* Cart Icon */}
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </div>
    
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
      Your Shopping Cart
    </h1>
    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
      Review your spiritual treasures and proceed to checkout for a journey of wellness and enlightenment
    </p>
  </div>
</div>
      {/* Product Data */}
      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4`}>
        {/* Product Images */}
        <div className={`flex-1 flex ${isMobile ? "flex-col-reverse gap-8" : "flex-row gap-4"}`}>
          {/* Thumbnails & Navigation */}
          <div className={`flex ${isMobile ? 'flex-row w-full justify-center items-center mb-4' : 'w-24 flex-col items-center justify-center'}`}>
            {showCarousel ? (
              <>
                {/* Prev Button */}
                <button
                  className={`${
                    isMobile ? 'mr-2' : 'mb-2'
                  } w-8 h-8 rounded-full border flex items-center justify-center text-gray-500 bg-white hover:bg-orange-100 hover:text-orange-600 transition ${(!canScrollPrev && images.indexOf(image) === thumbStart) ? 'opacity-40 cursor-not-allowed' : ''}`}
                  onClick={handlePrev}
                  disabled={!canScrollPrev && images.indexOf(image) === thumbStart}
                  aria-label="Previous"
                  type="button"
                >
                  {isMobile ? '◀' : '▲'}
                </button>
                {/* Thumbnails */}
                <div className={`flex ${isMobile ? 'flex-row gap-2' : 'flex-col gap-2'}`}>
                  {images.slice(thumbStart, thumbStart + VISIBLE_THUMBS).map((img, idx) => (
                    <img
                      key={thumbStart + idx}
                      src={img}
                      alt={`Product ${thumbStart + idx + 1}`}
                      onClick={() => handleThumbClick(img, thumbStart + idx)}
                      className={`cursor-pointer rounded border transition-all duration-150 ${img === image ? 'border-orange-500 scale-105' : 'border-gray-200'} w-20 h-20 object-cover`}
                    />
                  ))}
                </div>
                {/* Next Button */}
                <button
                  className={`${
                    isMobile ? 'ml-2' : 'mt-2'
                  } w-8 h-8 rounded-full border flex items-center justify-center text-gray-500 bg-white hover:bg-orange-100 hover:text-orange-600 transition ${(!canScrollNext && images.indexOf(image) === thumbStart + VISIBLE_THUMBS - 1) ? 'opacity-40 cursor-not-allowed' : ''}`}
                  onClick={handleNext}
                  disabled={!canScrollNext && images.indexOf(image) === thumbStart + VISIBLE_THUMBS - 1}
                  aria-label="Next"
                  type="button"
                >
                  {isMobile ? '▶' : '▼'}
                </button>
              </>
            ) : (
              // Single image, no carousel/buttons
              <img
                src={images[0]}
                alt={productData.name}
                className="rounded border border-gray-200 w-20 h-20 object-cover"
              />
            )}
          </div>
          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center">
            <div
              className="rounded-lg shadow-lg w-full max-w-[400px] h-[400px] bg-white flex items-center justify-center overflow-hidden"
              style={{ minWidth: 200, minHeight: 200 }}
            >
              <img
                src={image}
                alt={productData.name}
                className="w-full h-full object-contain"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-3xl">{productData.name}</h1>
            {/* Badges beside name */}
            {productData.bestseller && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">Bestseller</span>
            )}
            {productData.new && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">New</span>
            )}
            {/* Add other badges here beside name if needed */}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold text-orange-600">{currency}{productData.finalPrice}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">{currency}{productData.originalPrice}</span>
                <span className="text-xs text-red-600 font-bold ml-1">({discountPercent}% OFF)</span>
              </>
            )}
          </div>
          <p className="mt-2 text-gray-700">{productData.description}</p>
          <div className="flex items-center gap-4 mt-4">
            <label className="font-medium">Quantity:</label>
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))}
              className="w-16 border rounded px-2 py-1"
            />
          </div>
          <LoadingButton
            loading={loading}
            className="mt-6 w-full max-w-xs"
            onClick={handleAddToCart}
          >
            Add to Cart
          </LoadingButton>
          <div className="mt-8 border-t pt-4 text-sm text-gray-500 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery available.</p>
            <p>Easy return & exchange within 7 days.</p>
            <p>Category: <span className="font-medium text-gray-700">{productData.category}</span></p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-16">
        <div className="flex">
          <b className="border px-5 py-3 text-base rounded-t bg-gray-50">Description</b>
        </div>
        <div className="border px-6 py-6 text-gray-600 bg-white rounded-b">
          <p>{productData.description}</p>
        </div>
      </div>

      <div className="mt-16">
        <RelatedProducts category={productData.category} tags={productData.tags || []} currentProductId={productData._id} />
      </div>
    </div>
  )
}

export default Product