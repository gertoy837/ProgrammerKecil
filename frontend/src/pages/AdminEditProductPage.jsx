import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useProduct } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext";

export default function AdminEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { fetchProductById, updateProduct, fetchCategories, categories } = useProduct();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [product, setProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") { navigate("/"); return; }

    fetchCategories();
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      if (data) {
        setProduct(data);
        setFormData({
          name: data.name || "",
          categoryId: data.categoryId || "",
          price: data.price || "",
          stock: data.stock || "",
          description: data.description || "",
        });
        if (data.image) {
          const host = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
          setImagePreview(`${host}${data.image}`);
        }
      }
      setLoading(false);
      setMounted(true);
    };

    loadProduct();
  }, [authLoading, id, user, navigate, fetchProductById, fetchCategories]);

  if (authLoading) return null;

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
        setError("File must be an image");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setError("");
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (
        !formData.name ||
        !formData.categoryId ||
        !formData.price ||
        !formData.stock ||
        !formData.description
      ) {
        setError("Please fill out all fields.");
        setSaving(false);
        return;
      }

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("categoryId", parseInt(formData.categoryId, 10));
      submitData.append("price", parseFloat(formData.price));
      submitData.append("stock", parseInt(formData.stock, 10));
      submitData.append("description", formData.description);
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      const result = await updateProduct(id, submitData);
      if (!result.success) {
        throw new Error(result.error);
      }

      setSuccess("Product updated successfully!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      setError(err.message || "An error occurred while updating the product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-semibold text-on-surface-variant">Loading product details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="py-24 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">error_outline</span>
          <p className="text-sm font-semibold text-on-surface-variant">Product not found.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={`mx-auto transition-all duration-300 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-on-surface-variant font-semibold text-sm mb-1">Products</p>
            <h3 className="text-2xl font-extrabold text-on-surface">Edit Product</h3>
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
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Stock (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
                Price (Rp)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-2">
              Product Image
            </label>

            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden border border-outline-variant/30 max-w-sm aspect-square bg-surface-container-low mb-4">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="border-2 border-dashed border-outline-variant/30 bg-surface-container-low hover:border-primary/50 rounded-2xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="product-image-edit"
              />
              <label htmlFor="product-image-edit" className="cursor-pointer block">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/50 mb-2 block">upload_file</span>
                <p className="text-sm font-bold text-on-surface">Click to select new image</p>
                <p className="text-xs text-on-surface-variant/70 mt-1">Leave empty to keep current image (Max 5MB)</p>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/10">
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-4 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
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
