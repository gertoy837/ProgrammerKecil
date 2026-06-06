import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useProduct } from "../contexts/ProductContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Data will be fetched from backend via ProductContext
// categories, products, and recommendations are derived from the fetched list.

function ProductBadge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold shadow-sm ${className}`}
    >
      {children}
    </span>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { products, loading, fetchAllProducts } = useProduct();
  const [notification, setNotification] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  // Fetch products once when component mounts
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Derive unique categories from fetched products and assign icons
  const categories = useMemo(() => {
    const raw = products.map((p) => p.category?.name).filter(Boolean);
    const uniq = [...new Set(raw)];
    const iconMap = {
      Halfmoon: "water_drop",
      Plakat: "waves",
      Crowntail: "auto_awesome",
      Rosetail: "filter_vintage",
    };
    return uniq.map((name) => ({ name, icon: iconMap[name] || "category" }));
  }, [products]);

  // Simple recommendation list – take first 4 products (could be replaced with a smarter algorithm)
  const recommendations = useMemo(() => products.slice(0, 4), [products]);

  const handleAddToCart = async (productId, productTitle) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAddingToCart(productId);
    const result = await addToCart(productId, 1);
    setAddingToCart(null);

    if (result.success) {
      setNotification({ type: "success", message: `${productTitle} ditambahkan ke cart!` });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ type: "error", message: result.error || "Gagal menambahkan ke cart" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Show loading spinner while fetching products
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#4648d4] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading BettaVerse catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#191c1e]">
      {notification && (
        <div
          className={`fixed top-24 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-lg shadow-lg text-white transition-all ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}
      <Navbar />

      <header id="home" className="relative flex h-150 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Majestic Betta Fish"
            className="h-full w-full object-cover object-center scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJoCDI3Hg3SDfZGWWSvRVeoy3goEHbG2SLGgJNeK5ZgXT_NpmvyCtIADyVblkSGrOGex26AEeT8dJDo1sHteVqaaOSCvMszoqHCRtHXF3m3m5M8xr9xI4vCjStBKjWLk2cCEA60VMxspCp2DqMdQrQOiAi12y79fMaZuKl4it3HT6HX6vBzEMTRHijk0-Ev5VNZIdlJ5yPsg5LWEtv89hiSNx4nUbUhdpsuU86ulivNmUKj5N-3OZ1epIH46QE5rV1jvNAGAYr6w"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 px-4 text-center text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-white/75">Breeding Excellence</p>
          <h1 className="mx-auto max-w-6xl text-[clamp(64px,15vw,220px)] font-extrabold uppercase leading-[0.9] tracking-tighter text-white [text-shadow:0_0_1px_rgba(255,255,255,0.3)]">
            BettaVerse
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
            Where biological wonder meets breeding excellence.
          </p>
          <button
            type="button"
            className="mt-8 rounded-full bg-[#4648d4] px-10 py-4 text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-[#2f2ebe]"
          >
            Explore The Collection
          </button>
        </div>
      </header>

      <main id="shop" className="mx-auto mt-8 max-w-7xl px-4 py-8 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-6 rounded-[28px] border border-white/50 bg-white p-8 shadow-sm md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#12101a]">Give All You Need</h2>
            <p className="mt-1 text-[#464554]">Discover the finest specimens curated for your home.</p>
          </div>
          <div className="flex-1 md:ml-10 md:max-w-xl">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-[#767586]">search</span>
              <input
                className="w-full rounded-2xl border-none bg-[#f2f4f6] py-4 pl-12 pr-32 text-sm outline-none ring-0 focus:ring-2 focus:ring-[#4648d4]/20"
                placeholder="Search on BettaVerse..."
                type="text"
              />
              <button
                type="button"
                className="absolute right-2 rounded-xl bg-[#2d3133] px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-black"
              >
                
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <aside className="space-y-8 lg:col-span-3">
            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-2xl font-semibold text-[#12101a]">Category</h3>
              <div className="space-y-2">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl bg-[#4648d4]/10 p-4 font-bold text-[#4648d4]"
                    >
                      <span className="flex items-center gap-3">
                        <span className="material-symbols-outlined">inventory_2</span>
                        All Product
                      </span>
                      <span className="rounded-full bg-[#4648d4] px-2 py-0.5 text-xs text-white">{products.length}</span>
                    </button>
                    <div className="pl-4">
                      {categories.map((category) => {
                        const count = products.filter(p => p.category?.name === category.name).length;
                        return (
                          <a
                            key={category.name}
                            href="#"
                            className="flex items-center gap-3 rounded-xl p-3 text-[#464554] transition-colors hover:text-[#4648d4]"
                          >
                            <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                            {category.name}
                            <span className="ml-auto text-xs bg-[#4648d4]/20 px-2 py-0.5 rounded">{count}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-sm" id="tips">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#767586]">Filter By</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["New Arrival", false],
                  ["Best Seller", true],
                  ["On Discount", false],
                ].map(([label, checked]) => (
                  <label key={label} className="flex cursor-pointer items-center gap-3">
                    <input
                      defaultChecked={checked}
                      type="checkbox"
                      className="rounded border-[#c7c4d7] text-[#4648d4] focus:ring-[#4648d4]"
                    />
                    <span className="text-[#464554]">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-4xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative m-3 aspect-4/5 overflow-hidden rounded-3xl bg-[#f2f4f6]">
                    <div className="absolute right-4 top-4 z-10">
                      <ProductBadge className={product.category?.name === "Rare" ? "bg-[#6b38d4] text-white" : "bg-white/90 text-[#191c1e]"}>
                        {product.category?.name || ""}
                      </ProductBadge>
                    </div>
                    <img
                      alt={product.name}
                      src={product.image}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="px-6 pb-6 pt-2 text-left">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-[#12101a]">{product.name}</h4>
                      <span className="font-bold text-[#4648d4]">Rp {(product.price || 0).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="mb-6 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px] text-[#b90538]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="text-sm font-semibold text-[#12101a]">{product.averageRating?.toFixed(1) || "-"}</span>
                      <span className="text-xs text-[#767586]">({product.reviewCount || 0})</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product.id, product.name)}
                        disabled={addingToCart === product.id}
                        className="flex-1 rounded-2xl border border-[#c7c4d7]/50 py-3 text-sm font-semibold text-[#191c1e] transition-colors hover:bg-[#f2f4f6] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingToCart === product.id ? "Adding..." : "Add to Cart"}
                      </button>
                      <button
                        type="button"
                        className="flex-1 rounded-2xl bg-[#2d3133] py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-16 flex items-center justify-center gap-2">
              <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={page === 1 ? "flex h-10 w-10 items-center justify-center rounded-full bg-[#4648d4] font-bold text-white" : "flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white"}
                >
                  {page}
                </button>
              ))}
              <span className="px-2">...</span>
              <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white">
                10
              </button>
              <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-white/70 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#12101a]">Explore our recommendations</h2>
              <p className="mt-2 text-[#464554]">Specially picked by our expert breeders for you.</p>
            </div>
            <div className="flex gap-4">
              <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c7c4d7] bg-white transition-all hover:bg-[#f2f4f6]">
                <span className="material-symbols-outlined">west</span>
              </button>
              <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c7c4d7] bg-white transition-all hover:bg-[#f2f4f6]">
                <span className="material-symbols-outlined">east</span>
              </button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8">
            {recommendations.map((item) => (
              <article key={item.id} className="min-w-80 snap-start rounded-4xl bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <div className="mb-4 overflow-hidden rounded-3xl">
                  <img alt={item.name} src={item.image} className="h-full w-full object-cover" />
                </div>
                <div className="px-2 text-left">
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-[#12101a]">{item.name}</h4>
                    <span className="font-bold text-[#4648d4]">Rp {(item.price || 0).toLocaleString("id-ID")}</span>
                  </div>
                  <div className="mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#b90538]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="text-sm font-semibold text-[#12101a]">{item.averageRating?.toFixed(1) || "-"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item.id, item.name)}
                    disabled={addingToCart === item.id}
                    className="w-full rounded-2xl bg-[#2d3133] py-3 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart === item.id ? "Adding..." : "Add to cart"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-10 md:py-16">
        <div className="relative overflow-hidden rounded-[48px] bg-[#2d3133] p-8 text-white md:p-16">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#4648d4]/20 blur-[100px]" />
          <div className="relative z-10 grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-4xl font-extrabold leading-tight">Ready to Get Our New Stuff?</h2>
              <div className="mt-6 flex max-w-md items-center rounded-full bg-white/10 p-2 backdrop-blur-md">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full rounded-full border-none bg-transparent px-6 py-3 text-white outline-none placeholder:text-white/50"
                />
                <button type="button" className="rounded-full bg-white px-8 py-3 font-bold text-[#191c1e] transition-colors hover:bg-[#4648d4] hover:text-white">
                  Send
                </button>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="mb-2 text-lg font-bold">BettaVerse for Home and Needs</p>
              <p className="text-white/65">
                We listen to your needs, identify the best approach, and then create a bespoke premium collection that's right for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
