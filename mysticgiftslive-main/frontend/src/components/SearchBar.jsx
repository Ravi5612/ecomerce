import { useContext, useRef, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';

const SearchBar = ({ open, onClose }) => {
  const { search, setSearch } = useContext(ShopContext);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} className="absolute right-0 top-12 z-50 w-72 bg-white border rounded-xl shadow-lg p-4 flex items-center gap-2">
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="flex-1 outline-none bg-inherit text-sm px-2"
        type="text"
        placeholder="Search"
        autoFocus
      />
      <img className="w-4" src={assets.search_icon} alt="Search" />
      <img onClick={onClose} className="w-3 cursor-pointer" src={assets.cross_icon} alt="Close" />
    </div>
  );
};

export default SearchBar;