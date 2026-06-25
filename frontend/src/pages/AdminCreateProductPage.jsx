import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useProduct } from "../contexts/ProductContext";

export default function AdminCreateProductPage() {
  const navigate = useNavigate();
  const { categories, fetchCategories, createProduct } = useProduct();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
    setMounted(true);
  }, [fetchCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("File must be an image (JPG, PNG, GIF, WebP)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);
      setError("");

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (
        !formData.name ||
        !formData.categoryId ||
        !formData.price ||
        !formData.stock ||
        !formData.description ||
        !imageFile
      ) {
        setError("Please fill out all fields, including the product image.");
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("categoryId", parseInt(formData.categoryId, 10));
      submitData.append("price", parseFloat(formData.price));
      submitData.append("stock", parseInt(formData.stock, 10));
      submitData.append("description", formData.description);
      submitData.append("image", imageFile);

      const result = await createProduct(submitData);
      if (!result.success) {
        throw new Error(result.error);
      }

      setSuccess(`Product "${formData.name}" created successfully!`);

      setFormData({
        name: "",
        categoryId: "",
        price: "",
        stock: "",
        description: "",
      });
      setImageFile(null);
      setImagePreview(null);

      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "An error occurred while creating the product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className={`mx-auto transition-all duration-300 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-on-surface-variant font-semibold text-sm mb-1">Products</p>
            <h3 className="text-2xl font-extrabold text-on-surface">Add New Fish</h3>
          </div>
          <button
            onClick={() => navigate("/admin/products")}
            className="py-2.5 px-4 bg-surface-container-high text-on-surface-variant rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm"
          >
            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
            <span>Back</span>
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 bg-red-50 text-red-700 border border-red-200">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 bg-green-50 text-green-700 border border-green-200">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            {success}
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Blue Rim Halfmoon Premium"
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select Category</option>
                {categories?.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))
                ) : (
                  <option value="" disabled>Loading categories...</option>
                )}
              </select>
            </div>
          </div>
          {/* Price & Stock (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
                Price (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="150000"
                min="0"
                step="1000"
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="15"
                min="0"
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide information about fins, color patterns, sizing, care, and quality level..."
              rows="4"
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
              Product Image <span className="text-red-500">*</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-outline-variant/30 max-w-sm aspect-square bg-surface-container-low">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow hover:bg-red-700 transition-colors"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                >
                  <span className="material-symbols-outlined text-sm block">delete</span>
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-outline-variant/30 bg-surface-container-low hover:border-primary/50 rounded-2xl p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-input"
                />
                <label htmlFor="image-input" className="cursor-pointer block">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/50 mb-2 block">upload_file</span>
                  <p className="text-sm font-bold text-on-surface">Click to upload product photo</p>
                  <p className="text-xs text-on-surface-variant/70 mt-1">PNG, JPG, WebP, GIF (Max 5MB)</p>
                </label>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/10">
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-4 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Creating Product..." : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="py-3 px-4 bg-surface-container-high text-on-surface-variant rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
