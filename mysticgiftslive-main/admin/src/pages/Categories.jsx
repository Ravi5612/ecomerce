import { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from "../lib/config";
import LoadingButton from '../components/LoadingButton'
import Pagination from '../components/Pagination'
import { toast } from 'react-toastify'
import { useAdminAuth } from '../lib/AdminAuthContext.jsx'

const MAX_IMAGE_SIZE = 200 * 1024; // 200 KB
const PAGE_SIZE = 8;

const Categories = () => {
  const { accessToken } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Edit modal state
  const [editModal, setEditModal] = useState({ open: false, category: null });
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list');
      if (response.data.success) setCategories(response.data.categories);
    } catch (error) { toast.error("Failed to fetch categories"); }
  };

  // --- ADD CATEGORY ---
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    if (!newImage) {
      toast.error("Please select an image");
      return;
    }
    if (newImage.size > MAX_IMAGE_SIZE) {
      toast.error("Image too large. Please select a PNG or JPG under 200KB.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newCategory);
      formData.append("image", newImage);

      const response = await axios.post(
        backendUrl + '/api/category/add',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setNewCategory("");
        setNewImage(null);
        setNewImagePreview(null);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add category: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE CATEGORY ---
  const handleDeleteCategory = async (id) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/category/remove",
        { id },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  // --- EDIT IMAGE MODAL ---
  const openEditModal = (category) => {
    setEditModal({ open: true, category });
    setEditImagePreview(category.image);
    setEditImage(null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image too large. Please select a PNG or JPG under 200KB.");
      return;
    }
    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleEditImageSave = async () => {
    if (!editImage) {
      toast.error("Please select an image");
      return;
    }
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", editModal.category._id);
      formData.append("image", editImage);

      const response = await axios.post(
        backendUrl + "/api/category/edit-image",
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.data.success) {
        toast.success("Image updated!");
        setEditModal({ open: false, category: null });
        setEditImage(null);
        setEditImagePreview(null);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update image: " + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  // --- ADD IMAGE PREVIEW ---
  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image too large. Please select a PNG or JPG under 200KB.");
      return;
    }
    setNewImage(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  // Pagination logic
  const totalPages = Math.ceil(categories.length / PAGE_SIZE);
  const paginatedCategories = categories.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="w-full px-4 mx-auto py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-left">Manage Categories</h1>
      <p className="text-sm text-gray-500 mb-4">
        <b>Instructions:</b> Please upload a <b>PNG</b> or <b>JPG</b> image <b>(required)</b> under <b>200KB</b> for best results.<br />
        <span>Crop your image to exactly <b>300 x 300 px</b> before uploading.</span>
      </p>
      {/* Add Category */}
      <div className="flex flex-col gap-2 my-6 w-full max-w-md bg-gray-50 rounded-lg p-6 shadow">
        <label className="font-medium mb-1">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="Add new category"
          className="px-2 py-2 border rounded w-full"
        />
        <label className="font-medium mb-1">
          Category Image <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleNewImageChange}
          className="px-2 py-2 border rounded w-full"
        />
        {newImagePreview && (
          <img src={newImagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-full mt-2 border mx-auto" />
        )}
        <div className="flex justify-end mt-2">
          <LoadingButton
            type="button"
            onClick={handleAddCategory}
            loading={loading}
            text="Add"
          />
        </div>
      </div>
      {/* List Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-8">
        {paginatedCategories.map(cat => (
          <div key={cat._id} className="flex flex-col items-center bg-white rounded-lg shadow p-3">
            <img
              src={cat.image || 'https://via.placeholder.com/120x120?text=No+Image'}
              alt={cat.name}
              className="w-24 h-24 object-cover rounded-full border mb-2"
            />
            <div className="font-semibold text-base mb-1 text-center">{cat.name}</div>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => openEditModal(cat)}
                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                title="Edit Image"
              >
                Edit Image
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCategory(cat._id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 text-xs"
                title="Delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {/* Edit Image Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">Edit Category Image</h2>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleEditImageChange}
              className="mb-2"
            />
            {editImagePreview && (
              <img src={editImagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-full border mx-auto mb-4" />
            )}
            <div className="flex gap-2 mt-4 justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleEditImageSave}
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setEditModal({ open: false, category: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories