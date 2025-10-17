import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import CartTotal from '../components/CartTotal'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, getCartCount } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      const tempData = []
      for (const itemId in cartItems) {
        if (cartItems[itemId] && cartItems[itemId].quantity > 0) {
          tempData.push({
            _id: itemId,
            quantity: cartItems[itemId].quantity
          })
        }
      }
      setCartData(tempData)
    } else {
      setCartData([])
    }
  }, [cartItems, products])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* Left Side - Cart Items */}
          <div className="lg:col-span-8">
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center text-sm font-medium">
                <span className="text-purple-600 font-semibold">Review</span>
                <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-400">Payment</span>
                <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-400">Confirm</span>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart ({getCartCount()})
              </h1>
            </div>

            {/* Cart Items */}
            {cartData.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
                <p className="text-gray-500 mb-8">Start shopping to add items to your cart</p>
                <button
                  onClick={() => navigate('/collection')}
                  className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartData.map((item, index) => {
                  const productData = products.find((product) => product._id === item._id)
                  const cartItem = cartItems[item._id]
                  if (!productData || !cartItem) return null

                  const hasDiscount = Number(productData.originalPrice) > Number(productData.finalPrice)
                  const discountPercent = hasDiscount 
                    ? Math.round(((productData.originalPrice - productData.finalPrice) / productData.originalPrice) * 100)
                    : 0

                  return (
                    <div 
                      key={index} 
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6"
                    >
                      <div className="flex gap-6">
                        
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <img 
                            className="w-32 h-32 object-cover rounded-xl" 
                            src={productData.image?.[0]} 
                            alt={productData.name} 
                          />
                          {hasDiscount && (
                            <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              {discountPercent}% OFF
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {productData.name}
                              </h3>
                              {productData.variant && (
                                <span className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-lg">
                                  {productData.variant}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => updateQuantity(item._id, 0)}
                              className="text-gray-400 hover:text-red-500 transition ml-4"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Price */}
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-purple-600">
                                  {currency}{productData.finalPrice}
                                </span>
                                {hasDiscount && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {currency}{productData.originalPrice}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item._id, Math.max(1, cartItem.quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:text-purple-600 transition font-semibold"
                              >
                                −
                              </button>
                              <span className="w-12 text-center font-bold text-lg text-gray-900">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, Math.min(10, cartItem.quantity + 1))}
                                className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:text-purple-600 transition font-semibold"
                              >
                                +
                              </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-1">Subtotal</div>
                              <div className="text-xl font-bold text-gray-900">
                                {currency}{(productData.finalPrice * cartItem.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Cart Total */}
                <div className="mb-6">
                  <CartTotal />
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/place-order')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cartData.length === 0}
                  >
                    Proceed to Checkout →
                  </button>
                  
                  <button
                    onClick={() => navigate('/collection')}
                    className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50 transition"
                  >
                    ← Continue Shopping
                  </button>
                </div>

               
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart