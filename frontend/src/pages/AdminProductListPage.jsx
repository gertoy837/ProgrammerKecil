import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProduct } from "../contexts/ProductContext";
import MainLayout from "../components/MainLayout";

export default function AdminProductListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, loading, fetchAllProducts, deleteProduct } = useProduct();
  const [notification, setNotification] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchAllProducts();
  }, [user, navigate, fetchAllProducts]);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Hapus produk \"${product.name}\"? Tindakan ini tidak dapat dibatalkan.`,
    );
    if (!confirmed) return;

    setDeletingProductId(product.id);
    const result = await deleteProduct(product.id);
    setDeletingProductId(null);

    if (result.success) {
      setNotification({
        type: "success",
        message: `Produk \"${product.name}\" berhasil dihapus`,
      });
      fetchAllProducts();
    } else {
      setNotification({
        type: "error",
        message: result.error || "Gagal menghapus produk",
      });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {notification && (
          <div
            className={`rounded-2xl p-4 text-sm font-semibold ${
              notification.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">
              Kelola Produk
            </h1>
            <p className="mt-2 text-slate-500">
              Tambah, ubah, atau hapus produk yang tersedia di katalog.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/products/create"
              className="inline-flex items-center justify-center rounded-2xl bg-[#4648d4] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3b3dbb]"
            >
              + Buat Produk Baru
            </Link>
            <button
              type="button"
              onClick={fetchAllProducts}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <div className="col-span-full text-center py-12 text-slate-500">
                Memuat produk...
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500">
                Belum ada produk. Tambahkan produk baru terlebih dahulu.
              </div>
            ) : (
              products.map((product) => {
                const host =
                  (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
                const imageUrl = product.image ? `${host}${product.image}` : "";

                return (
                  <div
                    key={product.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-24 w-24 overflow-hidden rounded-3xl bg-white">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <span className="material-symbols-outlined text-4xl">
                              image_not_supported
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-900">
                          {product.name}
                        </h2>
                        <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">
                          {product.category?.name || "Tanpa Kategori"}
                        </p>
                        <p className="mt-3 text-sm text-slate-600 line-clamp-3">
                          {product.description || "Tidak ada deskripsi"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">Harga</p>
                        <p className="text-lg font-bold text-[#4648d4]">
                          Rp {(product.price || 0).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-slate-600">
                        Stok: {product.stock}
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#4648d4] border border-[#4648d4] transition hover:bg-[#4648d4]/10"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={deletingProductId === product.id}
                        onClick={() => handleDelete(product)}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingProductId === product.id ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
