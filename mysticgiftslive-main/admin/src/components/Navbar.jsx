import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = ({ onLogout }) => {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 md:px-8 py-2">
        <div className="flex items-center gap-3">
          <img
            className="w-10 h-10 md:w-14 md:h-14 object-contain"
            src={assets.logo}
            alt="Mystic Gifts Logo"
          />
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 whitespace-nowrap">MysticGifts</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="bg-blue-100 text-blue-700 px-4 md:px-7 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2"
          >
            <img src={assets.profile_icon} alt="Profile" className="w-5 h-5" />
            <span className="hidden md:inline">Profile</span>
          </Link>
          <button
            onClick={onLogout}
            className="bg-gray-600 text-white px-4 md:px-7 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
export default Navbar