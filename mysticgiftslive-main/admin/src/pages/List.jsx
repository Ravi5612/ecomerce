import axios from 'axios'
import { useEffect, useState } from 'react'
import { currency } from '../App'
import { backendUrl } from '../lib/config'
import { toast } from 'react-toastify'
import LoadingButton from '../components/LoadingButton'
import Pagination from '../components/Pagination'
import CropModal from '../components/CropModal'
import { useAdminAuth } from '../lib/AdminAuthContext'

const ITEMS_PER_PAGE = 5;

const List = () => {
  const { accessToken } = useAdminAuth();
  const [list, setList] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editTags, setEditTags] = useState('');
  const [editBestseller, setEditBestseller] = useState(false);
  const [editPremium, setEditPremium] = useState(false);
  const [editImages, setEditImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cropModal, setCropModal] = useState({ open: false, idx: null, src: null });
  const [filteredList, setFilteredList] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterInventory, setFilterInventory] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/category/list');
        if (response.data.success) setCategories(response.data.categories);
      } catch (error) {}
    };
    fetchCategories();
  }, []);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    setRemovingId(id);
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRemovingId(null);
    }
  };

  const openEditModal = (product) => {
    setEditProduct({
      ...product,
      originalPrice: product.originalPrice ?? '',
      finalPrice: product.finalPrice ?? ''
    });
    setEditTags(product.tags ? product.tags.join(', ') : '');
    setEditBestseller(!!product.bestseller || false);
    setEditPremium(!!product.premium || false);
    setEditImages((product.image || []).map(img => ({ src: img, isNew: false })));
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditProduct(null);
    setEditImages([]);
  };

  const handleEditChange = (field, value) => {
    setEditProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleRemoveEditImage = (idx) => {
    if (editImages.length <= 1) {
      toast.error("At least one image is required.");
      return;
    }
    setEditImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Add new image (after crop)
  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({ open: true, idx: editImages.length, src: reader.result, isNew: true });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Crop result: add to images as new
  const handleCrop = (croppedFile) => {
    setEditImages(prev => [...prev, { src: croppedFile, isNew: true }]);
  };

  // For editing (replacing) an existing image
  const handleEditImageChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({ open: true, idx, src: reader.result, isNew: false });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Crop result for replacing
  const handleCropReplace = (croppedFile) => {
    setEditImages(prev => prev.map((img, i) => i === cropModal.idx ? { src: croppedFile, isNew: true } : img));
  };

  // Unified crop handler
  useEffect(() => {
    if (!cropModal.open) return;
    if (cropModal.isNew) {
      cropModal.onCrop = handleCrop;
    } else {
      cropModal.onCrop = handleCropReplace;
    }
    // eslint-disable-next-line
  }, [cropModal]);

  // Unified crop modal handler
  const handleCropModal = (croppedFile) => {
    if (cropModal.isNew) {
      handleCrop(croppedFile);
    } else {
      handleCropReplace(croppedFile);
    }
    setCropModal({ open: false, idx: null, src: null, isNew: false });
  };

  // Submit handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (
      !editProduct.name?.trim() ||
      !editProduct.description?.trim() ||
      !editProduct.category?.trim() ||
      !editProduct.originalPrice ||
      !editProduct.finalPrice ||
      editImages.length === 0
    ) {
      toast.error("Please fill all required fields and ensure at least one image is present.");
      return;
    }
    if (Number(editProduct.finalPrice) > Number(editProduct.originalPrice)) {
      toast.error("Final price cannot be greater than original price");
      setLoading(false);
      return;
    }
    // Only count real images, not nulls
    const validImages = editImages.filter(img => !!img);
    if (validImages.length < 1) {
      toast.error("Please upload at least one image");
      setLoading(false);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("_id", editProduct._id);
    formData.append("name", editProduct.name);
    formData.append("description", editProduct.description);
    formData.append("originalPrice", editProduct.originalPrice);
    formData.append("finalPrice", editProduct.finalPrice);
    formData.append("category", editProduct.category);
    formData.append("tags", JSON.stringify(editTags.split(",").map(t => t.trim()).filter(Boolean)));
    formData.append("bestseller", editBestseller);
    formData.append("premium", editPremium);
    formData.append("inventory", editProduct.inventory);

    // Separate old and new images
    const oldImages = editImages.filter(img => !img.isNew).map(img => img.src);
    const newImages = editImages.filter(img => img.isNew).map(img => img.src);

    formData.append("image", JSON.stringify(oldImages));
    newImages.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const response = await axios.post(
        backendUrl + "/api/product/edit",
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.data.success) {
        toast.success("Product updated");
        closeEditModal();
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filtering and sorting logic
  useEffect(() => {
    let filtered = [...list];

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Filter by inventory
    if (filterInventory === 'low') {
      filtered = filtered.filter(item => Number(item.inventory) <= 5);
    } else if (filterInventory === 'out') {
      filtered = filtered.filter(item => Number(item.inventory) === 0);
    }

    // Search by name
    if (searchTerm.trim()) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sort
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => Number(a.finalPrice) - Number(b.finalPrice));
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => Number(b.finalPrice) - Number(a.finalPrice));
    } else if (sortBy === 'inventory-asc') {
      filtered.sort((a, b) => Number(a.inventory) - Number(b.inventory));
    } else if (sortBy === 'inventory-desc') {
      filtered.sort((a, b) => Number(b.inventory) - Number(a.inventory));
    } else if (sortBy === 'date-desc') {
      filtered.sort((a, b) => Number(b.date) - Number(a.date));
    } else if (sortBy === 'date-asc') {
      filtered.sort((a, b) => Number(a.date) - Number(b.date));
    }

    setFilteredList(filtered);
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [list, filterCategory, filterInventory, sortBy, searchTerm]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="w-full max-w-full overflow-hidden">
      {cropModal.open && (
        <CropModal
          image={cropModal.src}
          onClose={() => setCropModal({ open: false, idx: null, src: null, isNew: false })}
          onCrop={handleCropModal}
        />
      )}
      
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-left">All Products</h1>
        <p className="text-gray-500 mb-4 text-sm sm:text-base text-left">Manage your products below. Edit, remove, or update images easily.</p>
      </div>
      
      {/* Filters and Sorting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-blue-400 text-sm"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-blue-400 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <select
          value={filterInventory}
          onChange={e => setFilterInventory(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-blue-400 text-sm"
        >
          <option value="">All Inventory</option>
          <option value="low">Low Stock (&le; 5)</option>
          <option value="out">Out of Stock</option>
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-blue-400 text-sm"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="inventory-asc">Stock: Low to High</option>
          <option value="inventory-desc">Stock: High to Low</option>
        </select>
      </div>

      {/* Table Container with Proper Scrolling */}
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-[800px] w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-blue-50 text-gray-700">
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Image</th>
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Name</th>
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Category</th>
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Price</th>
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Inventory</th>
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Edit</th>
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Remove</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((item) => (
                <tr key={item._id} className="border-b hover:bg-blue-50 transition">
                  <td className="py-3 px-4">
                    <img
                      className="w-16 h-16 object-cover rounded-lg border mx-auto"
                      src={item.image?.[0] || "/no-image.png"}
                      alt={item.name}
                    />
                  </td>
                  <td className="py-3 px-4 font-semibold text-center max-w-[150px] truncate">{item.name}</td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">{item.category}</td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="text-orange-600 font-bold">{currency}{item.finalPrice}</span>
                    {item.originalPrice != item.finalPrice ? <span className="text-gray-400 line-through text-xs ml-1">{currency}{item.originalPrice}</span> : null}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">{item.inventory ?? 0}</td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition text-sm whitespace-nowrap"
                      title="Edit"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <LoadingButton
                      loading={removingId === item._id}
                      onClick={() => removeProduct(item._id)}
                      className="bg-red-600 mx-auto text-white px-3 py-1 rounded-lg font-semibold shadow hover:bg-red-700 transition text-sm whitespace-nowrap"
                      type="button"
                      text="Remove"
                    />
                  </td>
                </tr>
              ))}
              {paginatedList.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='flex justify-end mt-4'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Edit Modal - keeping your existing modal code */}
      {editModalOpen && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <form
            className="bg-white px-6 py-6 rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-y-auto max-h-[90vh]"
            onSubmit={handleEditSubmit}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Product Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={e => handleEditChange("name", e.target.value)}
                  placeholder="Name"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-blue-400 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                  value={editProduct.description}
                  onChange={e => handleEditChange("description", e.target.value)}
                  placeholder="Description"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-blue-400 text-sm"
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Inventory Stock <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={editProduct.inventory ?? 0}
                  onChange={e => handleEditChange("inventory", e.target.value)}
                  placeholder="1"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-blue-400 text-sm"
                  min={0}
                  onWheel={e => e.currentTarget.blur()}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Original Price <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={editProduct.originalPrice}
                    onChange={e => handleEditChange("originalPrice", e.target.value)}
                    placeholder="Original Price"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-blue-400 text-sm"
                    min={0}
                    onWheel={e => e.currentTarget.blur()}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Final Price <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={editProduct.finalPrice}
                    onChange={e => handleEditChange("finalPrice", e.target.value)}
                    placeholder="Final Price"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-blue-400 text-sm"
                    min={0}
                    onWheel={e => e.currentTarget.blur()}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Category <span className="text-red-500">*</span></label>
                  <select
                    value={editProduct.category}
                    onChange={e => handleEditChange("category", e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-blue-400 text-sm"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tags</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={e => setEditTags(e.target.value)}
                    placeholder="e.g. swan, couple, white"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-blue-400 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editBestseller}
                    onChange={() => setEditBestseller(prev => !prev)}
                    id="editBestseller"
                    className="accent-blue-600"
                  />
                  <label htmlFor="editBestseller" className="cursor-pointer font-medium">Bestseller</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editPremium}
                    onChange={() => setEditPremium(prev => !prev)}
                    id="editPremium"
                    className="accent-blue-600"
                  />
                  <label htmlFor="editPremium" className="cursor-pointer font-medium">Premium</label>
                </div>
              </div>
              {/* Images */}
              <div>
                <label className="block font-semibold mb-2">Images</label>
                <div className="flex gap-3 flex-wrap">
                  {editImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={typeof img.src === "string" ? (img.isNew && img.src instanceof File ? URL.createObjectURL(img.src) : img.src) : URL.createObjectURL(img.src)}
                        alt=""
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow text-sm"
                        onClick={() => handleRemoveEditImage(idx)}
                        title="Remove"
                      >
                        &times;
                      </button>
                      {!img.isNew && (
                        <label className="absolute bottom-0 left-0 bg-blue-500 text-white rounded px-1 text-xs cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleEditImageChange(e, idx)}
                            hidden
                          />
                          Edit
                        </label>
                      )}
                    </div>
                  ))}
                  {editImages.length === 0 && (
                    <span className="text-gray-400 text-sm">No images</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewImageChange}
                  className="mt-2 text-sm"
                />
              </div>
              <div className="flex gap-4 justify-center mt-6">
                <LoadingButton 
                  loading={loading} 
                  type="submit" 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition" 
                  text="Save" 
                />
                <LoadingButton 
                  type="button" 
                  onClick={closeEditModal} 
                  className="bg-gray-300 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-400 transition" 
                  text="Cancel" 
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default List;