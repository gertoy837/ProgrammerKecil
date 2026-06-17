import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { useProduct } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext";

export default function AdminEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchProductById, updateProduct, fetchCategories, categories } = useProduct();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [product, setProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
      return;
    }

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
    };

    loadProduct();
  }, [id, user, navigate, fetchProductById, fetchCategories]);

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
        setError("File harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran gambar tidak boleh lebih dari 5MB");
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
        setError("Semua field harus diisi");
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

      setSuccess("Produk berhasil diperbarui");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memperbarui produk");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-slate-500">Memuat data produk...</div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-slate-500">Produk tidak ditemukan.</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Edit Produk</h1>
          <p className="text-slate-500">Perbarui detail produk dan simpan perubahan.</p>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nama Produk</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
            >
              <option value="">Pilih kategori</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Harga (Rp)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Stok</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gambar Produk</label>
            <div className="rounded-3xl border border-dashed border-slate-300 p-5 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="product-image-edit"
              />
              <label htmlFor="product-image-edit" className="cursor-pointer text-sm text-slate-500 hover:text-[#4648d4]">
                Pilih gambar baru untuk mengganti gambar saat ini.
              </label>
            </div>
          </div>

          {imagePreview && (
            <div className="rounded-3xl border border-slate-200 overflow-hidden">
              <img src={imagePreview} alt="Preview" className="w-full object-cover" />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-[#4648d4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b3dbb] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
