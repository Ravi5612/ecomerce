import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import SimpleSwiper from '../ui/SimpleSwiper';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Discover our newest arrivals in spiritual wellness and mindful living. Handpicked for authenticity, beauty, and positive energy—explore the latest treasures from MysticGifts.
        </p>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <SimpleSwiper
          items={latestProducts}
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

export default LatestCollection