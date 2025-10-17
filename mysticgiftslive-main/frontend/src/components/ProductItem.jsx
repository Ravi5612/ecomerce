import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, originalPrice, finalPrice }) => {
  const { currency } = useContext(ShopContext);

  const imgSrc = image && image.length > 0 ? image[0] : 'https://via.placeholder.com/400x400?text=No+Image';
  const showDiscount = originalPrice > finalPrice;

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
      to={`/product/${id}`}
    >
      <div
        className="relative aspect-square w-full flex items-center justify-center overflow-hidden"
        style={{
          background: "radial-gradient(circle, #fff 60%, #e5e7eb 100%)"
        }}
      >
        <img
          src={imgSrc}
          alt={name}
          className="max-w-[90%] max-h-[90%] object-contain rounded-xl transition-transform duration-300 group-hover:scale-105 m-auto"
          loading="lazy"
        />
        {showDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
            SALE {Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}% OFF
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1">
        <p className="text-base font-semibold text-gray-800 truncate">{name}</p>
        <div className="flex items-center gap-2">
          <span className="text-orange-600 font-bold">{currency}{finalPrice}</span>
          {showDiscount && (
            <span className="text-gray-400 line-through text-sm">{currency}{originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductItem