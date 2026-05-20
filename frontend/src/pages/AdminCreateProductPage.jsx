import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import apiClient from "../utils/api";

export default function AdminCreateProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const categories = [
    "Cupang",
    "Aksesoris",
    "Makanan",
    "Obat",
    "Dekorasi",
  ];

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
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar (JPG, PNG, GIF, WebP)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran gambar tidak boleh lebih dari 5MB");
        return;
      }

      setImageFile(file);
      setError("");

      // Create preview
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
      // Validation
      if (
        !formData.name ||
        !formData.category ||
        !formData.price ||
        !formData.stock ||
        !formData.description ||
        !imageFile
      ) {
        setError("Semua field harus diisi termasuk gambar");
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("category", formData.category);
      submitData.append("price", parseFloat(formData.price));
      submitData.append("stock", parseInt(formData.stock));
      submitData.append("description", formData.description);
      submitData.append("image", imageFile);

      // Submit to API
      await apiClient.post("/products", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(`Produk "${formData.name}" berhasil dibuat!`);

      // Reset form
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
      });
      setImageFile(null);
      setImagePreview(null);

      // Redirect to product list after 2 seconds
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat membuat produk"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Buat Produk Baru
          </h1>
          <p className="text-gray-600">
            Tambahkan produk baru ke katalog BettaVerse Anda
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Contoh: Cupang Platinum"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4648d4] focus:border-transparent outline-none transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4648d4] focus:border-transparent outline-none transition"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price & Stock (Grid) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="50000"
                min="0"
                step="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4648d4] focus:border-transparent outline-none transition"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="10"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4648d4] focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Deskripsi detail produk..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4648d4] focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Produk <span className="text-red-500">*</span>
            </label>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#4648d4] transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                <div className="space-y-2">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-6-12l-3.172-3.172a4 4 0 00-5.656 0L9.172 12M21 16a4 4 0 110-8 4 4 0 010 8z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-gray-600 font-medium">
                    Klik untuk upload atau drag dan drop
                  </p>
                  <p className="text-gray-500 text-sm">
                    PNG, JPG, GIF, WebP (Max 5MB)
                  </p>
                </div>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview Gambar:
                </p>
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                      document.getElementById("image-input").value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#4648d4] text-white font-medium py-3 rounded-lg hover:bg-[#3a3bc0] disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? "Sedang Membuat..." : "Buat Produk"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
