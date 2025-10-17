import Hero from '../components/Hero'
import Categories from '../components/Categories'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import MarqueeText from '../components/marqueeText' 
import Premium from '../components/premium'
import Reviews from '../components/Review'

const Home = () => {
  return (
    <>
      <Hero />
      <MarqueeText />
      <div className='px-4 sm:px-6 lg:px-16'>
        <Categories />
        <Premium />
        <LatestCollection/>
        <BestSeller/>
        <Reviews />
        <OurPolicy/>
        <NewsletterBox/>
      </div>
      </>
  )
}

export default Home