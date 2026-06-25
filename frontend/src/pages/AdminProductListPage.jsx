import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProduct } from "../contexts/ProductContext";
import AdminLayout from "../components/AdminLayout";

export default function AdminProductListPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { products, loading, fetchAllProducts, deleteProduct } = useProduct();
  const [notification, setNotification] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") { navigate("/"); return; }
    fetchAllProducts();
    setMounted(true);
  }, [authLoading, user, navigate, fetchAllProducts]);

  if (authLoading) return null;

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Hapus produk "${product.name}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;
    setDeletingProductId(product.id);
    const result = await deleteProduct(product.id);
    setDeletingProductId(null);
    if (result.success) {
      setNotification({ type: "success", message: `Produk "${product.name}" berhasil dihapus` });
      fetchAllProducts();
    } else {
      setNotification({ type: "error", message: result.error || "Gagal menghapus produk" });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const host = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = products.filter((p) => (p.stock || 0) <= 5 && (p.stock || 0) > 0).length;
  const outOfStockCount = products.filter((p) => (p.stock || 0) === 0).length;

  return (
    <AdminLayout>
      <div className={`transition-all duration-300 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-on-surface-variant font-semibold text-sm mb-1">Products</p>
            <h3 className="text-2xl font-extrabold text-on-surface">Manage Products</h3>
          </div>
          <Link
            to="/admin/products/create"
            className="py-2.5 px-4 bg-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity text-sm"
          >
            <span className="material-symbols-outlined text-sm font-bold text-white">add</span>
            <span className="text-white">Add Product</span>
          </Link>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
            notification.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            <span className="material-symbols-outlined text-lg">
              {notification.type === "success" ? "check_circle" : "error"}
            </span>
            {notification.message}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex gap-4 mb-6 items-center">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input
              type="text"
              placeholder="Search product or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-full focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
          </div>
          <button
            onClick={fetchAllProducts}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full"
            title="Refresh"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>

        {/* Stats Summary Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 flex items-center gap-4">
            <div className="p-3 bg-primary-container/10 text-primary rounded-xl">
              <span className="material-symbols-outlined">inventory</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-semibold">Total Active Items</p>
              <h4 className="text-lg font-bold text-on-surface">{products.length}</h4>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-semibold">Low Stock Alert</p>
              <h4 className="text-lg font-bold text-on-surface">{lowStockCount}</h4>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-700 rounded-xl">
              <span className="material-symbols-outlined">error</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-semibold">Out of Stock</p>
              <h4 className="text-lg font-bold text-on-surface">{outOfStockCount}</h4>
            </div>
          </div>
        </div>

        {/* Products Table Container */}
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-semibold text-on-surface-variant">Loading products...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">inventory_2</span>
                <p className="text-sm font-semibold text-on-surface-variant">No products found.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-low text-on-surface-variant font-semibold">
                  <tr>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs">Product Details</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs">Category</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs">Price</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs">Stock Level</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                  {filtered.map((product) => {
                    const imageUrl = product.image ? `${host}${product.image}` : null;
                    const stock = product.stock || 0;
                    
                    let stockBadgeClass = "bg-green-50 text-green-700 border border-green-200";
                    if (stock === 0) {
                      stockBadgeClass = "bg-red-50 text-red-700 border border-red-200";
                    } else if (stock <= 5) {
                      stockBadgeClass = "bg-amber-50 text-amber-700 border border-amber-200";
                    }

                    return (
                      <tr key={product.id} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20 flex-shrink-0">
                              {imageUrl ? (
                                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg">🐟</div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-on-surface text-sm">{product.name}</p>
                              <p className="text-xs text-on-surface-variant/70 line-clamp-1 mt-0.5 max-w-xs md:max-w-md">
                                {product.description || "No description provided."}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant rounded-lg text-xs font-semibold">
                            {product.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-on-surface">
                          Rp {(product.price || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${stockBadgeClass}`}>
                            {stock} Items
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="p-1.5 hover:bg-surface-container-low rounded-lg text-on-surface-variant hover:text-primary transition-colors inline-block flex items-center"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-lg block">edit</span>
                            </Link>
                            <button
                              disabled={deletingProductId === product.id}
                              onClick={() => handleDelete(product)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-on-surface-variant hover:text-red-600 transition-colors flex items-center"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-lg block">
                                {deletingProductId === product.id ? "hourglass_empty" : "delete"}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && filtered.length > 0 && (
            <div className="px-6 py-4 bg-surface-container-low/20 border-t border-outline-variant/10 text-xs text-on-surface-variant font-semibold">
              Showing {filtered.length} of {products.length} active products
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
