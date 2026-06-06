import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductListPage() {
  const { products, loading, fetchAllProducts } = useProduct();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State Dinamis untuk Search, Filter, Sorting, dan Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Product");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // State untuk Cart
  const [addingToCart, setAddingToCart] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleAddToCart = async (productId, productTitle) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAddingToCart(productId);
    const result = await addToCart(productId, 1);
    setAddingToCart(null);

    if (result.success) {
      setNotification({
        type: "success",
        message: `${productTitle} added to cart!`,
      });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({
        type: "error",
        message: result.error || "Failed to add to cart",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#4648d4] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-500 animate-pulse">
            Loading BettaVerse Catalogue...
          </p>
        </div>
      </div>
    );
  }

  // ==================== LOGIKA FILTER, SEARCH, & SORTING ====================
  let filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "All Product"
        ? true
        : product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const rawCategories = products.map((p) => p.category?.name).filter(Boolean);
  const uniqueCategories = ["All Product", ...new Set(rawCategories)];

  const getCategoryCount = (catName) => {
    if (catName === "All Product") return products.length;
    return products.filter((p) => p.category?.name === catName).length;
  };

  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col justify-between font-sans relative">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 animate-[slideIn_0.3s_ease-out] ${
            notification.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {notification.type === "success" ? "check_circle" : "error"}
          </span>
          <span className="text-sm">{notification.message}</span>
        </div>
      )}

      {/* Navbar Atas */}
      <Navbar />

      {/* Konten Utama */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-10 py-8 flex-1">
        {/* BANNER HERO "DISCOVER LIVING JEWELS" LIGHT VERSION  */}
        <section className="relative h-72 mb-12 rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center shadow-md bg-slate-900">
          <img
            alt="Premium Aquarium Background"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.40] contrast-110"
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/30 z-10" />

          <div className="relative z-20 px-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight drop-shadow-md">
              Discover Living Jewels
            </h1>
            <p className="text-xs md:text-sm text-white/80 max-w-md mx-auto mb-6 leading-relaxed">
              Curating the world's most vibrant and rare Betta varieties for
              connoisseurs and enthusiasts alike.
            </p>

            {/* BOX PENCARIAN BERSIH */}
            <div className="flex items-center bg-white rounded-full p-1.5 shadow-lg max-w-md mx-auto border border-slate-200 focus-within:ring-2 focus-within:ring-[#4648d4]/20 transition-all">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, color, or rarity..."
                className="flex-1 bg-transparent border-none text-slate-700 placeholder:text-slate-400 font-semibold px-4 py-2 text-sm focus:outline-none focus:ring-0"
              />
              <button className="bg-[#4648d4] hover:bg-[#3b3dbb] text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all tracking-wider shadow-sm active:scale-95">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Layout Utama Kiri & Kanan */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR MENU KATEGORI*/}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-wide mb-4">
                Category
              </h3>
              <div className="space-y-1">
                {uniqueCategories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all capitalize ${
                        isActive
                          ? "bg-indigo-50/70 text-[#4648d4]"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg opacity-70">
                          {cat === "All Product" ? "grid_view" : "water_drop"}
                        </span>
                        <span>{cat}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-[#4648d4] text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {getCategoryCount(cat)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 my-5"></div>

              {/* Sorting di Bawah Kategori */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Sort By Price
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#4648d4] cursor-pointer shadow-sm transition-all"
                >
                  <option value="default">Default / Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* MAIN CATALOG AREA (CARD PUTIH MINIMALIS) */}
          <div className="flex-1">
            {currentItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">
                  inventory_2
                </span>
                <p className="text-slate-500 font-semibold">
                  {searchQuery
                    ? `No results found for "${searchQuery}"`
                    : `No betta fish available.`}
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentItems.map((product) => {
                    const host = (
                      import.meta.env.VITE_API_URL ||
                      "http://localhost:5000/api"
                    ).replace(/\/api\/?$/, "");
                    const imageUrl = product.image
                      ? `${host}${product.image}`
                      : "";

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                      >
                        <div>
                          {/* Image Wrapper */}
                          <Link
                            to={`/products/${product.id}`}
                          >
                            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50 flex items-center justify-center">
                              {imageUrl ? (
                                <img
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  src={imageUrl}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <span className="material-symbols-outlined text-4xl text-slate-300">
                                  image_not_supported
                                </span>
                              )}
                              {product.stock > 0 ? (
                                <span className="absolute top-4 left-4 bg-[#4648d4] backdrop-blur-sm text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                  Stock: {product.stock}
                                </span>
                              ) : (
                                <span className="absolute top-4 left-4 bg-slate-300 text-slate-600 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
                                  Sold Out
                                </span>
                              )}
                            </div>
                          </Link>

                          {/* Detail Info */}
                          <div className="px-1">
                            <h3 className="text-base font-bold text-slate-850 mb-1 group-hover:text-[#4648d4] transition-colors capitalize tracking-wide">
                              <Link
                                to={`/products/${product.id}`}
                                className="hover:underline"
                              >
                                {product.name}
                              </Link>
                            </h3>
                            <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                              {product.description ||
                                "Premium quality curated specimen."}
                            </p>
                          </div>
                        </div>

                        {/* Price & Action Button */}
                        <div className="px-1 mt-auto">
                          <div className="flex items-center justify-between mb-4 pt-3 border-t border-slate-50">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              Price
                            </span>
                            <span className="text-base font-extrabold text-[#4648d4]">
                              Rp {(product.price || 0).toLocaleString("id-ID")}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleAddToCart(product.id, product.name)
                            }
                            disabled={
                              addingToCart === product.id || product.stock <= 0
                            }
                            className="w-full py-3 bg-[#4648d4] hover:bg-[#3b3dbb] text-white rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-base">
                              shopping_cart
                            </span>
                            {addingToCart === product.id
                              ? "Adding..."
                              : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-12">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-sm">
                        chevron_left
                      </span>{" "}
                      Prev
                    </button>
                    <span className="text-xs font-semibold text-slate-400">
                      Page{" "}
                      <span className="text-slate-800 font-bold">
                        {currentPage}
                      </span>{" "}
                      of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      Next{" "}
                      <span className="material-symbols-outlined text-sm">
                        chevron_right
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Bawaan Tim */}
      <Footer />
    </div>
  );
}
