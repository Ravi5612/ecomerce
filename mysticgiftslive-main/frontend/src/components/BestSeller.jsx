import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import SimpleSwiper from '../ui/SimpleSwiper';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 10));
  }, [products]);

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Discover our most loved spiritual wellness products, handpicked for their authenticity, craftsmanship, and positive energy. Experience the best of MysticGifts—trusted by our community for mindful living and meaningful gifting.
        </p>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <SimpleSwiper
          items={bestSeller}
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
  );
};

export default BestSeller