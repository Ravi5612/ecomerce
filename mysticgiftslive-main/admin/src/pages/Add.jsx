import { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from "../lib/config";
import LoadingButton from '../components/LoadingButton'
import { toast } from 'react-toastify'
import CropModal from '../components/CropModal'
import { useAdminAuth } from '../lib/AdminAuthContext'

const Add = () => {
  const { accessToken } = useAdminAuth()
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [inventory, setInventory] = useState("");
  // const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  // const [sizes, setSizes] = useState([]);
  const [cropModal, setCropModal] = useState({ open: false, idx: null, src: null })

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleImageChange = (e, idx) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCropModal({ open: true, idx, src: reader.result })
      e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  const handleCrop = (croppedFile) => {
    setImages(prev => {
      const newImages = [...prev]
      newImages[cropModal.idx] = croppedFile
      return newImages
    })
  }

  const handleAddImage = () => {
    setImages(prev => [...prev, null]);
  };

  const handleRemoveImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (Number(finalPrice) > Number(originalPrice)) {
      toast.error("Final price cannot be greater than original price");
      setLoading(false);
      return;
    }
    // Only count real images, not nulls
    const validImages = images.filter(img => !!img);
    if (validImages.length < 1) {
      toast.error("Please upload at least one image");
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("originalPrice", originalPrice);
      formData.append("finalPrice", finalPrice);
      formData.append("category", category);
      formData.append("tags", JSON.stringify(tags.split(",").map(t => t.trim()).filter(Boolean)));
      formData.append("bestseller", bestseller);
      formData.append("premium", premium);
      formData.append("inventory", inventory);
      // formData.append("subCategory", subCategory);
      // formData.append("sizes", JSON.stringify(sizes));
      images.forEach((img, idx) => {
        if (img) formData.append(`image${idx + 1}`, img);
      });

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { Authorization: `Bearer ${accessToken}` } });

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImages([]);
        setOriginalPrice('');
        setTags('');
        setFinalPrice('');
        setCategory('');
        setBestseller(false);
        setPremium(false);
        setInventory('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {cropModal.open && (
        <CropModal
          image={cropModal.src}
          onClose={() => setCropModal({ open: false, idx: null, src: null })}
          onCrop={handleCrop}
        />
      )}
      <form
        onSubmit={onSubmitHandler}
        className="w-full p-0 m-0 text-left"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-left">Add Product</h1>

        {/* Images */}
        <div>
          <label className="block font-semibold mb-2">Upload Images <span className='text-red-500'>*</span></label>
          <div className="flex gap-3 flex-wrap">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <label htmlFor={`image${idx}`}>
                  <img
                    className="w-20 h-20 object-cover rounded border"
                    src={!img ? assets.upload_area : URL.createObjectURL(img)}
                    alt=""
                  />
                  <input
                    onChange={e => handleImageChange(e, idx)}
                    type="file"
                    id={`image${idx}`}
                    hidden
                    accept="image/*"
                  />
                </label>
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  onClick={() => handleRemoveImage(idx)}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded text-gray-500"
              onClick={handleAddImage}
              title="Add Image"
            >
              +
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          <div>
            <label className="block font-semibold mb-2">Product Name <span className='text-red-500'>*</span></label>
            <input
              onChange={e => setName(e.target.value)}
              value={name}
              className="w-full px-3 py-2 border rounded focus:outline-blue-400"
              type="text"
              placeholder="Type here"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Product Category <span className='text-red-500'>*</span></label>
            <select
              onChange={e => setCategory(e.target.value)}
              value={category}
              className="w-full px-3 py-2 border rounded focus:outline-blue-400"
              required
            >
              <option value="" disabled>Select category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Inventory Stock <span className='text-red-500'>*</span></label>
            <input
              onChange={e => setInventory(e.target.value)}
              value={inventory}
              className="w-full px-3 py-2 border rounded focus:outline-blue-400"
              type="number"
              placeholder="1"
              min={0}
              required
              onWheel={e => e.currentTarget.blur()}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Tags (comma separated)</label>
            <input
              onChange={e => setTags(e.target.value)}
              value={tags}
              className="w-full px-3 py-2 border rounded focus:outline-blue-400"
              type="text"
              placeholder="e.g. swan, couple, white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Product Original Price <span className='text-red-500'>*</span></label>
            <input
              onChange={e => setOriginalPrice(e.target.value)}
              value={originalPrice}
              className="w-full px-3 py-2 border rounded focus:outline-blue-400"
              type="number"
              placeholder="25"
              min={0}
              required
              onWheel={e => e.currentTarget.blur()}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Final Price (if no discount, add same Price) <span className='text-red-500'>*</span> </label>
            <input
              onChange={e => setFinalPrice(e.target.value)}
              value={finalPrice}
              className="w-full px-3 py-2 border rounded focus:outline-blue-400"
              type="number"
              placeholder="0"
              min={0}
              required
              onWheel={e => e.currentTarget.blur()}
            />
          </div>
        </div>

        {/* Product Description */}
        <div>
          <label className="block font-semibold mb-2">Product Description <span className='text-red-500'>*</span></label>
          <textarea
            onChange={e => setDescription(e.target.value)}
            value={description}
            className="w-full px-3 py-2 border rounded focus:outline-blue-400"
            placeholder="Write content here"
            required
            rows={3}
          />
        </div>

        {/* Product Checkboxes */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <input
              onChange={() => setBestseller(prev => !prev)}
              checked={bestseller}
              type="checkbox"
              id="bestseller"
              className="accent-blue-600"
            />
            <label className="cursor-pointer font-medium" htmlFor="bestseller">Add to bestseller</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              onChange={() => setPremium(prev => !prev)}
              checked={premium}
              type="checkbox"
              id="premium"
              className="accent-blue-600"
            />
            <label className="cursor-pointer font-medium" htmlFor="premium">Add to premium</label>
          </div>
        </div>

        <LoadingButton type="submit" text="Add" loading={loading} className="mt-4" />

        {/* <div>
          <p className='mb-2'>Sub category</p>
          <select onChange={e => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div> */
        /* SIZES <div>
          <p className='mb-2'>Product Sizes</p>
          <div className='flex gap-3'>
            <div onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter( item => item !== "S") : [...prev,"S"])}>
              <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>S</p>
            </div>
            
            <div onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter( item => item !== "M") : [...prev,"M"])}>
              <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>M</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter( item => item !== "L") : [...prev,"L"])}>
              <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>L</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("XL") ? prev.filter( item => item !== "XL") : [...prev,"XL"])}>
              <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>XL</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("XXL") ? prev.filter( item => item !== "XXL") : [...prev,"XXL"])}>
              <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>XXL</p>
            </div>
          </div>
        </div> */}
      </form>
    </>
  )
}

export default Add