import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from './Title'
import SimpleSwiper from '../ui/SimpleSwiper'
import { ShopContext } from '../context/ShopContext'

const CategoryItem = ({ category }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col items-center pb-4">
      <button
        onClick={() => {
          navigate(`/collection?category=${encodeURIComponent(category.name)}`);
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "auto" });
          }, 100);
        }}
        className="group relative w-full h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-slate-700 bg-zinc-100 dark:bg-slate-800 transition-all duration-300 hover:shadow-2xl focus:outline-none"
        style={{ minHeight: 180 }}
      >
        {/* Background Image */}
        <img
          src={category.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90"
        />
        {/* Text Box */}
        <div className="absolute bottom-0 left-0 w-full px-4 py-3 flex flex-col items-start z-10">
          <span className="inline-block bg-white/80 dark:bg-slate-900/80 px-3 py-2 rounded-lg shadow text-base sm:text-lg lg:text-xl font-semibold text-zinc-900 dark:text-white backdrop-blur-sm">
            {category.name}
          </span>
        </div>
      </button>
    </div>
  )
}

const Categories = () => {
  const { categories } = useContext(ShopContext);

  return (
    <div className="my-10">
      <div className="container px-2 sm:px-4 lg:px-8 mx-auto relative bg-transparent text-zinc-900 dark:text-white overflow-visible z-10">
        <div className='text-center py-8 text-3xl'>
          <Title text1={'SHOP'} text2={'BY CATEGORY'} />
          <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mb-5'>
            Explore our curated categories for unique spiritual gifts and home decor.
          </p>
        </div>
        <SimpleSwiper 
          items={categories}
          renderItem={category => <CategoryItem key={category._id} category={category} />}
        />
      </div>
    </div>
  )
}

export default Categories