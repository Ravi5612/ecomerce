"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';

function FeatureCard() {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="font-sans flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white">
      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center max-w-4xl leading-tight mb-6">
        Join Our Content Creator Community & Spread Spiritual Wellness
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 text-center max-w-3xl mb-8">
        Become part of MysticGifts' mission to share authentic spiritual wisdom. Create meaningful content, grow your audience, earn rewards, and help others discover the transformative power of mindful living and Indian spiritual traditions.
      </p>

      {/* Testimonial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-6xl">
        {/* Main Testimonial */}
        <div className="bg-white/80 dark:bg-black/50 p-8 rounded-xl flex flex-col justify-between border border-gray-200 dark:border-gray-800 backdrop-blur-sm shadow-md">
          <div className="mb-8">
            {/* Icon */}
            <div className="flex items-center mb-6">
              <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200 leading-relaxed mb-8">
              "Joining MysticGifts as a content creator transformed my spiritual journey. I'm not just earning from my passion for wellness content, but actively helping people discover authentic Indian spiritual practices. The community support and creative freedom here is incredible - it's like being part of a spiritual family!"
            </p>
          </div>
          <div className="flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
              alt="Arjun Sharma" 
              className="w-12 h-12 rounded-full object-cover mr-4" 
              onError={e => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/48x48/8B5CF6/FFFFFF?text=AS";
              }} 
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Arjun Sharma</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Spiritual Wellness Creator</p>
            </div>
          </div>
        </div>

        {/* Secondary Testimonials */}
        <div className="flex flex-col gap-4">
          {/* Second Testimonial */}
          <div className="bg-white/80 dark:bg-black/50 p-8 rounded-xl flex flex-col justify-between border border-gray-200 dark:border-gray-800 backdrop-blur-sm shadow-md">
            <p className="text-base sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200 leading-relaxed mb-8">
              "Creating content about Indian copper bottles and Ayurvedic practices with MysticGifts has been so fulfilling. I love sharing authentic wellness wisdom while building a sustainable income stream. The team's support for creative expression is amazing!"
            </p>
            <div className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b4ac?w=150&h=150&fit=crop&crop=face" 
                alt="Priya Patel" 
                className="w-12 h-12 rounded-full object-cover mr-4" 
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/48x48/8B5CF6/FFFFFF?text=PP";
                }} 
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Priya Patel</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ayurveda Content Creator</p>
              </div>
            </div>
          </div>

          {/* Small Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Third Testimonial */}
            <div className="bg-white/80 dark:bg-black/50 p-6 rounded-xl flex flex-col justify-between border border-gray-200 dark:border-gray-800 backdrop-blur-sm shadow-md">
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed mb-6">
                "The freedom to create authentic Indian spiritual content while earning is a dream come true. MysticGifts values cultural authenticity and spiritual growth - exactly what I'm passionate about!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                  alt="Raj Kumar" 
                  className="w-10 h-10 rounded-full object-cover mr-3" 
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/40x40/8B5CF6/FFFFFF?text=RK";
                  }} 
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Raj Kumar</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Spiritual Blogger</p>
                </div>
              </div>
            </div>

            {/* Fourth Testimonial */}
            <div className="bg-white/80 dark:bg-black/50 p-6 rounded-xl flex flex-col justify-between border border-gray-200 dark:border-gray-800 backdrop-blur-sm shadow-md">
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed mb-6">
                "Being part of MysticGifts' creator community means spreading goodness while growing professionally. The collaboration opportunities and spiritual focus make this so much more than just content creation!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" 
                  alt="Meera Singh" 
                  className="w-10 h-10 rounded-full object-cover mr-3" 
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/40x40/8B5CF6/FFFFFF?text=MS";
                  }} 
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Meera Singh</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Wellness Influencer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Share Your Spiritual Journey?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Join our community of passionate content creators and help spread authentic spiritual wellness. Whether you're into yoga, Ayurveda, meditation, or Indian cultural traditions - we'd love to collaborate with you.
        </p>
        <div className="flex justify-center">
          <button 
            onClick={handleContactClick}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Contact Us to Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeatureCard;