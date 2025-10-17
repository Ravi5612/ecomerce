import { NavLink } from 'react-router-dom'
import { FaHome, FaList, FaBoxOpen, FaPlus, FaEnvelope, FaTags, FaUsers, FaBlog, FaUserTie } from 'react-icons/fa'

const links = [
  { to: "/", icon: <FaHome />, label: "Dashboard" },
  { to: "/list", icon: <FaList />, label: "List Items" },
  { to: "/orders", icon: <FaBoxOpen />, label: "Orders" },
  { to: "/add", icon: <FaPlus />, label: "Add Items" },
  { to: "/messages", icon: <FaEnvelope />, label: "Messages" },
  { to: "/categories", icon: <FaTags />, label: "Categories" },
  { to: "/subscribers", icon: <FaEnvelope />, label: "Subscribers" },
  { to: "/admin/blogs", icon: <FaBlog />, label: "Blogs" },
  { to: "/admin/creators", icon: <FaUserTie />, label: "Creators" },
];

const Sidebar = () => {
  return (
    <aside
      className="
        h-screen
        bg-white
        border-r
        flex flex-col
        items-center
        px-1
        w-[60px]
        md:w-[180px]
        transition-all
        duration-200
        fixed
        z-30
        left-0
        top-0
        pt-24
        overflow-y-auto
      "
    >
      <nav className="flex flex-col gap-2 w-full mt-2 relative items-center">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-2 py-2 rounded-lg w-full transition
              ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"}
              justify-center md:justify-start relative`
            }
            title={link.label}
          >
            <span className="w-6 h-6 flex items-center justify-center text-xl">{link.icon}</span>
            <span
              className={`
                hidden md:inline
                transition-all duration-200
                whitespace-nowrap
                group-hover:font-bold
              `}
            >
              {link.label}
            </span>
            <span className="md:hidden absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
              {link.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar