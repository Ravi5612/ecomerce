import { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { socialLinks } from '../assets/socialLinks';

function Footer() {
  const [visible, setVisible] = useState(false);
  const { categories } = useContext(ShopContext);

  // Optional: Add scroll detection for dynamic effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show blur effect when near bottom of page
      const nearBottom = scrollPosition + windowHeight >= documentHeight - 200;
      setVisible(nearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'COLLECTION', href: '/collection' },
    { name: 'BLOG', href: '/blog' },
    { name: 'CONTACT', href: '/contact' },
  ];

const socialIcons = [
    {
      name: 'TikTok',
      href: socialLinks.tiktok,
      svg: (
        <svg className="size-5 md:size-6 transition-transform duration-200 hover:scale-110" viewBox="0 0 32 32" fill="currentColor">
          <path d="M24.5 7.5c-1.7-1.1-2.7-2.7-2.7-4.5h-4.3v20.2c0 1.7-1.4 3.1-3.1 3.1s-3.1-1.4-3.1-3.1c0-1.7 1.4-3.1 3.1-3.1.3 0 .6 0 .9.1v-4.3c-.3 0-.6-.1-.9-.1-4.1 0-7.4 3.3-7.4 7.4s3.3 7.4 7.4 7.4 7.4-3.3 7.4-7.4V12.2c1.2.9 2.6 1.5 4.1 1.5V7.5h-2.3z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      href: socialLinks.facebook,
      svg: (
        <svg className="size-5 md:size-6 transition-transform duration-200 hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"></path>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: socialLinks.instagram,
      svg: (
        <svg className="size-5 md:size-6 transition-transform duration-200 hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path>
        </svg>
      )
    }
  ];

  return (
    <footer 
      className="py-6 md:py-10 px-4 sm:px-6 lg:px-8 font-inter relative overflow-hidden transition-all duration-300 bg-gradient-to-br from-purple-900 via-indigo-900 to-black"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        borderRadius: "50px 50px 0 0",
      }}
    >
      {/* Mobile Layout - Compact */}
      <div className="md:hidden">
        {/* Brand and Social Icons */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <img 
              src="/vite.svg" 
              width="30" 
              height="30" 
              className="drop-shadow-lg rounded-lg"
            />
            <h3 className="text-lg font-extrabold text-white drop-shadow-lg">MysticGifts</h3>
          </div>
          <div className="flex justify-center space-x-4 mb-3">
            {/* Only TikTok, Facebook, Instagram */}
            {socialIcons.map(icon => (
              <a key={icon.name} target="_blank" rel="noopener noreferrer" aria-label={icon.name} className="text-gray-200 hover:text-white transition-colors duration-300" href={icon.href}>
                {icon.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Compact Navigation */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white mb-2">Quick Links</h4>
            <ul className="space-y-1">
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-300 hover:text-white transition-colors duration-300 text-xs">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex flex-col items-end'>
            <h4 className="text-sm font-bold text-white mb-2">Products</h4>
            <ul className="space-y-1 flex flex-col items-end">
              {categories.slice(0, 4).map(cat => (
                <li key={cat._id}>
                  <Link
                    to={`/collection?category=${encodeURIComponent(cat.name)}`}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-xs"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info - Minimal */}
        <div className="text-center text-xs text-gray-300 mb-3">
          <p>📍 Cairns City, QLD 4870</p>
        </div>
      </div>

      {/* Desktop Layout - Full */}
      <div className="hidden md:block">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/vite.svg" 
                width="40" 
                height="40" 
                className="drop-shadow-lg rounded-lg"
              />
              <h3 className="text-2xl font-extrabold text-white drop-shadow-lg">MysticGifts</h3>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">
              Discover authentic spiritual products and mystical gifts to enhance your spiritual journey and well-being.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialIcons.map(icon => (
                <a key={icon.name} target="_blank" rel="noopener noreferrer" aria-label={icon.name} className="text-gray-200 hover:text-white transition-colors duration-300" href={icon.href}>
                  {icon.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-200 hover:text-white transition-colors duration-300 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Products</h3>
            <ul className="space-y-1">
              {categories.slice(0, 4).map(cat => (
                <li key={cat._id}>
                  <Link
                    to={`/collection?category=${encodeURIComponent(cat.name)}`}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-xs"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-200">📍 Cairns City,QLD 4870</p>
              <p className="text-gray-200">📝 <Link to="/contact" className="underline">Send us a message</Link></p>
              <p className="text-gray-200">🕰️ Mon–Fri, 10am–5pm AEST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-300 text-xs md:text-sm pt-4 md:pt-10 mt-4 md:mt-10 border-t border-gray-300/30">
        <p>&copy; {new Date().getFullYear()} MysticGifts. All rights reserved.</p>
        <p className="mt-1 md:mt-2">Designed with <span className="text-pink-300">♥</span> for spiritual seekers</p>
      </div>
    </footer>
  );
}

export default Footer;