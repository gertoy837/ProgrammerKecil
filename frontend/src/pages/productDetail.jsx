import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../contexts/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await apiClient.get(`/products/${id}`);
        if (mounted) setProduct(res.data.product);
      } catch (err) {
        console.error("Failed to load product detail:", err);
      }
    }
    if (id) load();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    async function loadRelated() {
      try {
        if (!product || !product.categoryId) {
          setRelated([]);
          return;
        }
        const res = await apiClient.get("/products");
        const others = (res.data.products || []).filter(
          (p) => p.id !== product.id && p.categoryId === product.categoryId,
        );
        if (mounted) setRelated(others.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch related products", err);
      }
    }
    loadRelated();
    return () => {
      mounted = false;
    };
  }, [product]);

  const handleAddToCart = async () => {
    setLoadingCart(true);
    setCartSuccess("");
    const res = await addToCart(product.id, 1);
    if (res.success) {
      setCartSuccess("Added to cart!");
      setTimeout(() => setCartSuccess(""), 3000);
    } else {
      setCartSuccess(`Failed: ${res.error}`);
      setTimeout(() => setCartSuccess(""), 3000);
    }
    setLoadingCart(false);
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#4648d4] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-500 animate-pulse">
            Loading Product Details...
          </p>
        </div>
      </div>
    );
  }

  const host = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  ).replace(/\/api\/?$/, "");
  const imageUrl = product.image ? `${host}${product.image}` : "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 md:px-10 py-12 flex-1">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-[#4648d4] transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <Link
            to="/products"
            className="hover:text-[#4648d4] transition-colors"
          >
            Shop
          </Link>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="font-semibold text-slate-800">{product.name}</span>
        </div>

        {/* Product Detail Section */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-10">
          {/* Image */}
          <div className="w-full lg:w-1/2 aspect-square rounded-2xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <span className="material-symbols-outlined text-6xl text-slate-300">
                image_not_supported
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1">
            <div className="mb-2">
              <span className="inline-block bg-indigo-50 text-[#4648d4] text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                {product.categoryName || "Betta Fish"}
              </span>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-amber-500 text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="font-bold text-slate-800">
                    {product.averageRating || "0.0"}
                  </span>
                  <span className="text-slate-400">
                    ({product.reviewCount || 0} Reviews)
                  </span>
                </div>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <div
                  className={`font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}
                >
                  {product.stock > 0
                    ? `${product.stock} In Stock`
                    : "Out of Stock"}
                </div>
              </div>
            </div>

            <div className="text-3xl font-extrabold text-[#4648d4] mb-8 pb-8 border-b border-slate-100">
              Rp {Number(product.price || 0).toLocaleString("id-ID")}
            </div>

            <div className="mb-8 flex-1">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {product.description ||
                  "Here you'll find the premium details about this specific Betta fish. Known for exceptional genetics and vibrant colors."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-auto">
              {cartSuccess && (
                <div
                  className={`text-sm font-semibold p-3 rounded-xl mb-2 text-center ${cartSuccess.includes("Failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                >
                  {cartSuccess}
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={loadingCart || product.stock <= 0}
                className="w-full py-4 bg-[#4648d4] hover:bg-[#3b3dbb] text-white rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                {loadingCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Related products */}
        <section className="mt-20 mb-10">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Related Products
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Discover other premium selections in this category.
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-bold text-[#4648d4] flex items-center gap-1"
            >
              <span className="hover:underline">View All</span>

              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">
                  inventory_2
                </span>
                <p className="text-sm text-slate-500 font-semibold">
                  No related products found in this category.
                </p>
              </div>
            ) : (
              related.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-50 mb-4 relative flex items-center justify-center">
                      {p.image ? (
                        <img
                          src={`${host}${p.image}`}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <span className="material-symbols-outlined text-4xl text-slate-300">
                          image_not_supported
                        </span>
                      )}
                      {p.stock <= 0 && (
                        <span className="absolute top-3 left-3 bg-slate-800/80 backdrop-blur-sm text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-850 mb-1 group-hover:text-[#4648d4] transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
                    <span className="text-sm font-extrabold text-[#4648d4]">
                      Rp {Number(p.price || 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
