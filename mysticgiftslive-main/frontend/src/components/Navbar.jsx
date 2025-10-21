import { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import {
  Navbar as ResizeableNavbarContainer,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavMenu,
  MobileNavToggle,
} from '../ui/resizeable-navbar'

const navLinks = [
  { name: 'Home', link: '/' },
  { name: 'Collection', link: '/collection' },
  { name: 'Blog', link: '/blog' },
  { name: 'Contact', link: '/contact' },
]

const NavbarLogo = () => (
  <Link
    to="/"
    className="relative z-20 flex items-center space-x-2 px-2 py-1"
  >
    <img
      src={assets.logo_mini}
      alt="MysticGifts Logo"
      width={50}
      height={41}
      className="h-10 w-auto"
      loading="lazy"
    />
    <span className='text-xl font-bold hover:scale-105 transition-transform duration-300 hidden sm:block text-blue-600'>
      MysticGifts
    </span>
  </Link>
)

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false)
  const { getCartCount, navigate, token, logout, role, user } = useContext(ShopContext)
  const location = useLocation()

  const handleNavItemClick = () => setMobileOpen(false)

  return (
    <>
      {/* ✅ Desktop Navbar ONLY */}
      <div className="hidden lg:block fixed inset-x-0 top-0 z-50 w-full  shadow-sm">
        <ResizeableNavbarContainer>
          <NavBody className="flex justify-between items-center">
            <div className="flex items-center gap-10 flex-shrink-0">
              <NavbarLogo />
              <NavItems items={navLinks} onItemClick={handleNavItemClick} />
            </div>

            <div className='flex items-center gap-6 flex-shrink-0'>
              {/* Search Icon */}
              <img
                onClick={() => { navigate('/collection#search'); window.scrollTo(0, 0) }}
                src={assets.search_icon}
                className='w-5 cursor-pointer filter hover:scale-110 transition-transform duration-300'
                alt="Search"
              />

              {/* Profile / Sign In */}
              <div
                className='relative'
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                {token ? (
                  <img
                    className='w-5 cursor-pointer filter hover:scale-110 transition-transform duration-300'
                    src={assets.profile_icon}
                    alt="Profile"
                  />
                ) : (
                  <img
                    onClick={() => { navigate('/login'); window.scrollTo(0, 0) }}
                    className='w-5 cursor-pointer filter hover:scale-110 transition-transform duration-300'
                    src={assets.signin_icon}
                    alt="Sign In"
                  />
                )}

                {/* Dropdown */}
                {token && (
                  <div
                    className={`absolute right-0 pt-4 transition-all duration-200 z-50 ${
                      profileDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                  >
                    <div className='flex flex-col gap-3 w-56 py-5 px-7 bg-white text-gray-700 rounded-xl shadow-2xl border border-gray-200'>
                      <p className='font-semibold text-lg text-black mb-2'>
                        Welcome back,<br />
                        <span className="text-blue-600">{user?.name || 'User'}</span>!
                      </p>
                      <button
                        className='text-left px-2 py-2 rounded hover:bg-blue-50 transition'
                        onClick={() => {
                          navigate(role === 'creator' ? '/creator-profile' : '/profile')
                          window.scrollTo(0, 0)
                        }}
                      >
                        My Profile
                      </button>
                      <button
                        className='text-left px-2 py-2 rounded hover:bg-blue-50 transition'
                        onClick={() => { navigate('/orders'); window.scrollTo(0, 0) }}
                      >
                        Orders
                      </button>
                      <button
                        className='text-left px-2 py-2 rounded hover:bg-blue-50 transition text-red-600'
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to='/cart' className='relative'>
                <img
                  src={assets.cart_icon}
                  className='w-5 min-w-5 filter hover:scale-110 transition-transform duration-300'
                  alt="Cart"
                />
                <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-white text-[#1b2a41] aspect-square rounded-full text-[8px]'>
                  {getCartCount()}
                </p>
              </Link>
            </div>
          </NavBody>
        </ResizeableNavbarContainer>
      </div>

      {/* ✅ Mobile Navbar ONLY */}
      <div className="block lg:hidden fixed top-0 inset-x-0 z-50 shadow-sm bg-transparent">

        <div className="flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link to='/' className='flex items-center gap-3'>
            <img src={assets.logo_mini} className='w-10 h-auto hover:scale-110 transition-transform duration-300' alt="Logo" />
            <span className='text-xl font-bold text-blue-600'>MysticGifts</span>
          </Link>

          {/* Right side */}
          <div className='flex items-center gap-5'>
            <img
              onClick={() => { navigate('/collection#search'); window.scrollTo(0, 0) }}
              src={assets.search_icon}
              className='w-6 h-6 cursor-pointer filter hover:scale-110 transition-transform duration-300'
              alt="Search"
            />

            {token ? (
              <img
                onClick={() => setMobileProfileOpen(true)}
                className='w-6 h-6 cursor-pointer filter hover:scale-110 transition-transform duration-300'
                src={assets.profile_icon}
                alt="Profile"
              />
            ) : (
              <img
                onClick={() => { navigate('/login'); window.scrollTo(0, 0) }}
                className='w-6 h-6 cursor-pointer filter hover:scale-110 transition-transform duration-300'
                src={assets.signin_icon}
                alt="Sign In"
              />
            )}

            <Link to='/cart' className='relative'>
              <img
                src={assets.cart_icon}
                className='w-6 h-6 filter hover:scale-110 transition-transform duration-300'
                alt="Cart"
              />
              <p className='absolute right-[-6px] bottom-[-6px] w-4 text-center leading-4 bg-white text-[#1b2a41] aspect-square rounded-full text-[8px]'>
                {getCartCount()}
              </p>
            </Link>

            {/* Hamburger */}
            <MobileNavToggle isOpen={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} />
          </div>
        </div>

        {/* Slide Menu */}
        <MobileNav visible={mobileOpen}>
          <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
            {navLinks.map((item) => (
              <NavLink
                key={item.link}
                to={item.link}
                onClick={handleNavItemClick}
                className={`py-2 pl-2 w-full transition-colors duration-200 ${
                  location.pathname === item.link
                    ? 'text-blue-600 font-bold'
                    : 'hover:text-blue-500'
                }`}
              >
                {item.name}
              </NavLink>
            ))}
          </MobileNavMenu>
        </MobileNav>

        {/* Mobile Profile Modal */}
        {token && mobileProfileOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
            onClick={() => setMobileProfileOpen(false)}
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-[90vw] max-w-sm flex flex-col gap-3 py-8 px-6"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700"
                onClick={() => setMobileProfileOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <p className="font-semibold text-lg text-black mb-2 text-center">
                Welcome back,<br />
                <span className="text-blue-600">{user?.name || 'User'}</span>!
              </p>
              <button
                className="text-left px-3 py-3 rounded hover:bg-blue-50 transition text-base"
                onClick={() => {
                  navigate(role === 'creator' ? '/creator-profile' : '/profile')
                  setMobileProfileOpen(false)
                  window.scrollTo(0, 0)
                }}
              >
                My Profile
              </button>
              <button
                className="text-left px-3 py-3 rounded hover:bg-blue-50 transition text-base"
                onClick={() => {
                  navigate('/orders')
                  setMobileProfileOpen(false)
                  window.scrollTo(0, 0)
                }}
              >
                Orders
              </button>
              <button
                className="text-left px-3 py-3 rounded hover:bg-blue-50 transition text-base text-red-600"
                onClick={() => {
                  logout()
                  setMobileProfileOpen(false)
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar
