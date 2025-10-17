import EnquiryForm from '../components/EnquiryForm'
import SimpleBanner from '../components/Blog/SimpleBanner'
import Faq8 from '../components/Blog/Faq'
import { socialLinks } from '../assets/socialLinks'

const Contact = () => {
  // FAQ data for the contact page - formatted for Faq component (title/content)
  const faqItems = [
    {
      title: "How can I contact MysticGifts for content creator opportunities?",
      content: "You can reach out to us through our contact form above, email us at mysticgiftsad@gmail.com, or connect with us on our social media channels. We're always looking for passionate content creators who share our vision of spreading spiritual wellness and authentic Indian culture."
    },
    {
      title: "What types of content creators are you looking for?",
      content: "We welcome creators passionate about spiritual wellness, Indian culture, Ayurveda, yoga, meditation, sustainable living, and authentic lifestyle content. Whether you're a blogger, social media influencer, videographer, photographer, or wellness coach, we'd love to hear from you if you can authentically represent our brand values."
    },
    {
      title: "Do you offer affiliate or partnership programs?",
      content: "Yes! We have various collaboration opportunities including affiliate partnerships, sponsored content, product collaborations, brand ambassador programs, and content creator partnerships. We provide competitive commissions, free products for review, and co-marketing opportunities. Contact us to discuss what works best for your audience and content style."
    },
    {
      title: "How quickly do you respond to collaboration inquiries?",
      content: "We typically respond to all inquiries within 1-2 business days during our business hours (Mon-Fri: 9AM-6PM AEST). For content creator applications, we may take up to a week to review your portfolio, social media presence, and get back to you with next steps and collaboration details."
    },
    {
      title: "Can international content creators work with MysticGifts?",
      content: "Absolutely! While we're based in Australia, we welcome content creators from around the world who are passionate about spiritual wellness and can authentically represent our brand values. We have partnerships with creators from India, USA, UK, Canada, and other countries who share our mission of spreading authentic spiritual wellness."
    },
    {
      title: "What products do you specialize in?",
      content: "We specialize in authentic Indian spiritual and wellness products including copper bottles, wind chimes, traditional home decor, antique designs, meditation tools, Ayurvedic accessories, brass items, spiritual artifacts, and handcrafted items from skilled Indian artisans. All our products are carefully curated for authenticity and spiritual significance."
    },
    {
      title: "Do you ship internationally?",
      content: "Yes, we ship across Australia and internationally. We offer fast and secure shipping with tracking. Australian orders typically arrive within 3-7 business days, while international shipping varies by location. We partner with reliable courier services to ensure your spiritual treasures reach you safely."
    },
    {
      title: "What is your return policy?",
      content: "We offer a 30-day satisfaction guarantee on all our products. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange. Items must be in original condition. We believe in the quality of our authentic spiritual products and want you to be completely happy with your purchase."
    }
  ];

  return (
    <div className='px-2 py-20 sm:px-4 md:px-8 lg:px-16'>
      {/* Banner Section */}
      <div className='mb-8'>
        <SimpleBanner 
          title="Our Complete Collection"
          description="Explore our entire range of mystical gifts and spiritual products carefully curated for your spiritual journey and well-being"
        />
      </div>

      {/* About Section */}
      <div className="my-10 flex flex-col items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Our Mission */}
            <div className="md:col-span-1 text-center md:text-left mb-8 md:mb-0 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                To make authentic spiritual wellness accessible to everyone, while supporting traditional artisans and sustainable practices. We believe that spiritual growth and environmental consciousness go hand in hand.
              </p>
            </div>
            {/* Our Story */}
            <div className="md:col-span-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Story</h3>
              <p className="text-base leading-relaxed mb-4">
                MysticGifts was born from a deep passion for spiritual wellness and the transformative power of mindful living. Our journey began when we discovered how authentic spiritual tools could enhance daily life and bring profound positive change.
              </p>
            </div>
            {/* Our Promise */}
            <div className="md:col-span-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Promise</h3>
              <p className="text-base leading-relaxed">
                We carefully curate each product in our collection, working directly with skilled artisans who honor traditional craftsmanship and spiritual practices. From copper bottles that purify water and balance energy, to wind chimes that harmonize your space, every item is chosen for its authenticity and spiritual significance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl">
        {/* Contact Information and Why Choose Us */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Contact Image */}
            <div>
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Mystical spiritual items - MysticGifts authentic Indian products"
                className="w-full h-56 sm:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">mysticgiftsad@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">Brisbane, Queensland, Australia</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm font-medium text-gray-900">Business Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri: 9AM-6PM AEST</p>
                    <p className="text-sm text-gray-600">Sat-Sun: 10AM-4PM AEST</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9" />
                    </svg>
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm font-medium text-gray-900">Follow Us</p>
                    <div className="flex space-x-4 mt-1">
                      <a href={socialLinks.facebook} target='_blank' className="text-sm text-purple-600 hover:text-purple-800 transition-colors">Facebook</a>
                      <a href={socialLinks.instagram} target='_blank' className="text-sm text-purple-600 hover:text-purple-800 transition-colors">Instagram</a>
                      <a href={socialLinks.tiktok} target='_blank' className="text-sm text-purple-600 hover:text-purple-800 transition-colors">TikTok</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Why Choose Us Section */}
          <div className="mt-12">
            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose MysticGifts?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Authentic Products</h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Genuine spiritual products from trusted Indian artisans with traditional craftsmanship and authentic materials.
                </p>
              </div>
              {/* Card 2 */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Expert Support</h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Spiritual guidance, fast Australian shipping, and 30-day satisfaction guarantee for your peace of mind.
                </p>
              </div>
              {/* Card 3 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Eco-Conscious</h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Sustainable practices supporting traditional artisans while promoting environmental consciousness and wellness.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form & FAQ - Aligned and Same Width */}
        <div className="flex flex-col gap-8 items-center mb-16">
          <div className="w-full max-w-3xl">
            <div className="md:py-6 bg-[linear-gradient(90deg,#a78bfa,#f472b6,#fde047)] dark:bg-[#0b1727] text-black relative overflow-hidden z-10 border border-white/30 rounded-3xl shadow-2xl backdrop-blur-md">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">Send Us a Message</h3>
              <EnquiryForm />
            </div>
            <Faq8 items={faqItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact