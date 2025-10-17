import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { backendUrl } from "../lib/config";
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import SimpleBanner from '../components/Blog/SimpleBanner'
import api from '../lib/api'
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 12;

const Collection = () => {
  const { products, search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [categoriesList, setCategoriesList] = useState([])
  const [onSale, setOnSale] = useState(false)
  const [premium, setPremium] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get URL search params for category filtering
  const [searchParams] = useSearchParams()

  // Get category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setCategory([categoryParam])
    }
    const premiumParam = searchParams.get('premium')
    if (premiumParam) {
      setPremium(true)
    }
    const saleParam = searchParams.get('sale')
    if (saleParam) {
      setOnSale(true)
    }
  }, [searchParams]);

  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const response = await api.get(backendUrl + '/api/category/list');
        if (response.data.success) {
          setCategoriesList(response.data.categories);
        }
      } catch (error) {
        setCategoriesList([]);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice()

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => 
        category.includes(item.category)
      )
    }

    // Premium filter
    if (premium) {
      productsCopy = productsCopy.filter(item => item.premium === true)
    }

    // On Sale filter (originalPrice > finalPrice)
    if (onSale) {
      productsCopy = productsCopy.filter(item => Number(item.originalPrice) > Number(item.finalPrice))
    }

    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice()

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.finalPrice - b.finalPrice)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.finalPrice - a.finalPrice)));
        break;
      default:
        applyFilter()
        break
    }
  }

  useEffect(() => {
    applyFilter()
  }, [category, search, showSearch, products, premium, onSale])

  useEffect(() => {
    sortProduct()
  }, [sortType])

  useEffect(() => {
    setCurrentPage(1);
  }, [category, search, showSearch, products, premium, onSale]);

  // Paginate products
  const totalPages = Math.ceil(filterProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filterProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className='px-4 py-20 sm:px-6 lg:px-16'>
      {/* Banner Section */}
      <div className='mb-8'>
        <SimpleBanner 
          title="Our Complete Collection"
          description="Explore our entire range of mystical gifts and spiritual products carefully curated for your spiritual journey and well-being"
        />
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-lg flex items-center gap-2 bg-white rounded-xl shadow-md px-4 py-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none border-none bg-transparent text-base px-2"
            type="text"
            placeholder="Search products..."
            autoFocus={false}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setShowSearch(true);
              }
            }}
          />
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="p-1"
            aria-label="Search"
          >
            <img className="w-5" src={assets.search_icon} alt="Search" />
          </button>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-8 border-t'>
        
        {/* Filter Options */}
        <div className='min-w-60 pb-6'>
          <p 
            onClick={() => setShowFilter(!showFilter)} 
            className='my-2 text-xl flex items-center cursor-pointer gap-2'
          >
            FILTERS
            <img 
              className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} 
              src={assets.dropdown_icon} 
              alt="Toggle filters" 
            />
          </p>
          
          {/* Category Filter */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              {categoriesList.length > 0 ? (
                categoriesList.map((cat, idx) => (
                  <p className='flex gap-2' key={cat._id || idx}>
                    <input
                      className='w-3'
                      type="checkbox"
                      value={cat.name}
                      onChange={toggleCategory}
                      checked={category.includes(cat.name)}
                    />
                    {cat.name}
                  </p>
                ))
              ) : (
                <span className="text-xs text-gray-400">No categories found</span>
              )}
            </div>
          </div>

          {/* Premium & On Sale Filters */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>FEATURES</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <p className='flex gap-2'>
                <input 
                  className='w-3' 
                  type="checkbox" 
                  checked={premium}
                  onChange={e => setPremium(e.target.checked)}
                />
                Premium
              </p>
              <p className='flex gap-2'>
                <input 
                  className='w-3' 
                  type="checkbox" 
                  checked={onSale}
                  onChange={e => setOnSale(e.target.checked)}
                />
                On Sale
              </p>
            </div>
          </div>

          {/* Reset Filters Button */}
          <button
            className={`mt-6 w-full bg-gray-300 hover:bg-blue-100 text-gray-800 font-medium py-2 rounded transition ${showFilter ? '' : 'hidden'} sm:block`}
            onClick={() => {
              setCategory([]);
              setPremium(false);
              setOnSale(false);
              setSearch('');
              setShowSearch(false);
            }}
            type="button"
          >
            Reset Filters
          </button>
        </div>

        {/* Right Side - Products */}
        <div className='flex-1'>
          <div className='flex flex-col sm:flex-row justify-between text-base sm:text-2xl mb-4 gap-2 sm:gap-0'>
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            
            {/* Sort dropdown */}
            <select 
              onChange={(e) => setSortType(e.target.value)} 
              value={sortType}
              className='border-2 border-gray-300 text-sm px-2 py-1 rounded mt-2 sm:mt-0'
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Products Count */}
          <div className='mb-4'>
            <p className='text-sm text-gray-600'>
              Showing {filterProducts.length} products
              {category.length > 0 && (
                <span className='ml-2'>
                  in {category.join(', ')}
                </span>
              )}
              {premium && <span className='ml-2'>| Premium</span>}
              {onSale && <span className='ml-2'>| On Sale</span>}
            </p>
          </div>

          {/* Map Products */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((item, index) => (
                <ProductItem 
                  key={item._id || index} 
                  name={item.name} 
                  id={item._id} 
                  originalPrice={item.originalPrice}
                  finalPrice={item.finalPrice} 
                  image={item.image} 
                />
              ))
            ) : (
              <div className='col-span-full text-center py-8'>
                <p className='text-gray-500 text-lg'>No products found</p>
                <p className='text-gray-400 text-sm mt-2'>
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}

export default Collection