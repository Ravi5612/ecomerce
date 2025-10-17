import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import SimpleSwiper from '../ui/SimpleSwiper'

const RelatedProducts = ({ category, tags = [], currentProductId }) => {
  const { products } = useContext(ShopContext)
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice()
      // Exclude current product
      productsCopy = productsCopy.filter(item => item._id !== currentProductId)
      // Filter by category or tags
      productsCopy = productsCopy.filter(item =>
        item.category === category &&
        (Array.isArray(item.tags) && tags.some(tag => item.tags.includes(tag)))
      )
      setRelated(productsCopy)
    }
  }, [products, category, tags, currentProductId])

  if (related.length === 0) return null

  return (
    <div className="my-10 w-full">
      <div className="text-center py-8 text-3xl w-full">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className="w-full">
        <SimpleSwiper
          items={related}
          slidesPerView={4}
          responsiveConfig={{ mobile: 1, tablet: 2, desktop: 4 }}
          renderItem={item => (
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              originalPrice={item.originalPrice}
              finalPrice={item.finalPrice}
            />
          )}
        />
      </div>
    </div>
  )
}

export default RelatedProducts