import { assets } from '../assets/assets'
import Title from './Title'

const OurPolicy = () => {
  return (
    <div className="bg-white px-4 py-12 sm:py-16 md:py-20">
      <div className='max-w-6xl mx-auto'>
        <div className="text-center mb-10">
          <Title text1="OUR" text2="POLICIES" />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
            Discover our commitment to quality, support, and sustainability. We strive to deliver the best experience for every customer.
          </p>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 text-center'>
          <div className='flex flex-col items-center space-y-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
            <img 
              src={assets.delivery} 
              className='w-10 h-10 sm:w-12 sm:h-12 object-contain' 
              alt="Fast Delivery"
            />
            <p className='font-semibold text-xs sm:text-sm md:text-base text-gray-700 leading-tight'>
              Fast & Reliable Delivery
            </p>
          </div>
          <div className='flex flex-col items-center space-y-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
            <img 
              src={assets.support} 
              className='w-10 h-10 sm:w-12 sm:h-12 object-contain' 
              alt="Support" 
            />
            <p className='font-semibold text-xs sm:text-sm md:text-base text-gray-700 leading-tight'>
              Friendly Customer Support, Always Here for You
            </p>
          </div>
          <div className='flex flex-col items-center space-y-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
            <img 
              src={assets.trust} 
              className='w-10 h-10 sm:w-12 sm:h-12 object-contain' 
              alt="Customer Satisfaction" 
            />
            <p className='font-semibold text-xs sm:text-sm md:text-base text-gray-700 leading-tight'>
              Satisfaction Guaranteed
            </p>
          </div>
          <div className='flex flex-col items-center space-y-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
            <img 
              src={assets.eco} 
              className='w-10 h-10 sm:w-12 sm:h-12 object-contain' 
              alt="Eco-Friendly" 
            />
            <p className='font-semibold text-xs sm:text-sm md:text-base text-gray-700 leading-tight'>
              Eco-Friendly Assurance
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OurPolicy