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

  // === PERUBAHAN: State untuk Pagination ===
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;

  // Fetch products once when component mounts
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // === PERUBAHAN: Logika memotong data produk ===
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);


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
            onClick={() => navigate('/products')}
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
                      onClick={() => navigate('/products')}
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
                          <button
                            key={category.name}
                            type="button"
                            onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
                            className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-[#464554] transition-colors hover:text-[#4648d4]"
                          >
                            <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                            <span className="truncate">{category.name}</span>
                            <span className="ml-auto text-xs bg-[#4648d4]/20 px-2 py-0.5 rounded">{count}</span>
                          </button>
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
              {currentProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-4xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                >
                  <div
                    className="relative m-3 aspect-4/5 overflow-hidden rounded-3xl bg-[#f2f4f6]"
                  >
                    <div className="absolute right-4 top-4 z-10">
                      <ProductBadge className={product.category?.name === "Rare" ? "bg-[#6b38d4] text-white" : "bg-white/90 text-[#191c1e]"}>
                        {product.category?.name || ""}
                      </ProductBadge>
                    </div>
                    <img
                        alt={product.name}
                        src={`http://localhost:5000${product.image}`}
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="h-full w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                  </div>
                  <div className="px-6 pb-6 pt-2 text-left">
                    <div className="mb-2 flex items-center justify-between">
                      <h4
                        className="text-lg font-semibold text-[#12101a] cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {product.name}
                      </h4>
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
                        onClick={() => navigate(`/products/${product.id}`)}
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
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    currentPage === i + 1 ? "bg-[#4648d4] font-bold text-white" : "hover:bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white disabled:opacity-30"
              >
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
                  <article key={item.id} className="w-80 shrink-0 flex flex-col snap-start rounded-4xl bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                    <div className="mb-4 w-full aspect-square overflow-hidden rounded-3xl bg-[#f2f4f6]">
                      <img 
                        alt={item.name} 
                        src={`http://localhost:5000${item.image}`} 
                        className="h-full w-full object-cover object-center" 
                      />
                    </div>
                    <div className="px-2 text-left flex-1 flex flex-col">
                      <h4 className="text-lg font-semibold text-[#12101a] truncate">{item.name}</h4>
                      <span className="font-bold text-[#4648d4]">Rp {(item.price || 0).toLocaleString("id-ID")}</span>
                      <button onClick={() => handleAddToCart(item.id, item.name)} className="mt-auto w-full rounded-2xl bg-[#2d3133] py-3 text-sm font-semibold text-white mt-4">
                        Add to cart
                      </button>
                    </div>
                  </article>
                ))}
              </div>    
        </div>
      </section>

        {/* ── Care Tips ── */}
      <section id="care" className="mx-auto max-w-7xl px-4 py-16 md:px-10 md:py-24">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="mb-3 rounded-full bg-[#4648d4]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#4648d4]">
            Expert Guidance
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#12101a] md:text-4xl">
            Betta Care Essentials
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#464554]">
            Keep your betta vibrant and thriving with these simple, proven tips from our expert breeders.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              icon: "water_drop", color: "bg-blue-50 text-blue-600", 
              title: "Water Quality", 
              desc: "Keep temp at 24–28°C & pH 6.5–7.5. Change 25% water weekly to prevent ammonia." 
            },
            { 
              icon: "restaurant", color: "bg-orange-50 text-orange-600", 
              title: "Feeding Routine", 
              desc: "Feed 2–3 small meals daily (high-protein). Remove uneaten food after 5 mins." 
            },
            { 
              icon: "home", color: "bg-purple-50 text-purple-600", 
              title: "Tank Setup", 
              desc: "Minimum 10L tank with gentle flow. Leave space at the top for surface breathing." 
            },
            { 
              icon: "healing", color: "bg-red-50 text-red-600", 
              title: "Health Check", 
              desc: "Watch for clamped fins or pale colors. Treat fin rot or ich early with proper meds." 
            },
            { 
              icon: "wb_sunny", color: "bg-yellow-50 text-yellow-600", 
              title: "Lighting & Rest", 
              desc: "8–10 hours of light daily. Avoid direct sunlight and ensure total darkness at night." 
            },
            { 
              icon: "diversity_1", color: "bg-green-50 text-green-600", 
              title: "Tank Mates", 
              desc: "Males are strictly solitary. Never pair two males. Snails or bottom feeders are okay." 
            },
          ].map((tip) => (
            <div 
              key={tip.title} 
              className="group relative overflow-hidden rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4648d4]/20 hover:shadow-md"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${tip.color}`}>
                <span className="material-symbols-outlined text-[24px]">{tip.icon}</span>
              </div>
              <h3 className="mb-2 text-[17px] font-bold text-[#12101a]">{tip.title}</h3>
              <p className="text-[14px] leading-relaxed text-[#767586]">{tip.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 rounded-[32px] border border-[#4648d4]/10 bg-gradient-to-br from-[#4648d4]/5 to-transparent p-6 md:grid-cols-4 md:p-8">
          {[
            { value: "24–28°C", label: "Ideal Temp" },
            { value: "6.5–7.5", label: "pH Range" },
            { value: "10+ L", label: "Min Tank" },
            { value: "3–5 Yrs", label: "Lifespan" },
          ].map((fact) => (
            <div key={fact.label} className="text-center">
              <p className="text-2xl font-black tracking-tight text-[#4648d4] md:text-3xl">{fact.value}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#767586]">{fact.label}</p>
            </div>
          ))}
        </div>
      </section>

     {/* ── About ── */}
      <section id="about" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-10">

          {/* Bagian Atas: Cerita & Gambar */}
          <div className="mb-16 grid gap-10 md:grid-cols-2 md:items-center">
            <div className="order-2 md:order-1">
              <span className="mb-4 inline-block rounded-full bg-[#4648d4]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#4648d4]">
                Our Story
              </span>
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#12101a] md:text-5xl">
                Passion for Betta.<br />Built with Purpose.
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-[#464554]">
                BettaVerse was born from a deep love for betta fish and a desire to connect dedicated breeders with enthusiasts who truly care. We believe every betta deserves a home that understands its beauty and biology.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-[#464554]">
                From our humble beginnings breeding locally to building a full catalogue of premium specimens, our mission has always been the same: <strong>make excellence in betta fish accessible to everyone.</strong>
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="rounded-full bg-[#4648d4] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4648d4]/30 transition-all hover:-translate-y-1 hover:bg-[#2f2ebe]"
                >
                  Shop Now
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full border-2 border-[#f2f4f6] bg-transparent px-8 py-3.5 text-sm font-bold text-[#12101a] transition-all hover:border-[#c7c4d7] hover:bg-[#f2f4f6]"
                >
                  Care Tips
                </button>
              </div>
            </div>

            <div className="relative order-1 md:order-2">
              <div className="aspect-[4/3] overflow-hidden rounded-[32px] bg-[#f2f4f6] shadow-2xl shadow-black/5">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJoCDI3Hg3SDfZGWWSvRVeoy3goEHbG2SLGgJNeK5ZgXT_NpmvyCtIADyVblkSGrOGex26AEeT8dJDo1sHteVqaaOSCvMszoqHCRtHXF3m3m5M8xr9xI4vCjStBKjWLk2cCEA60VMxspCp2DqMdQrQOiAi12y79fMaZuKl4it3HT6HX6vBzEMTRHijk0-Ev5VNZIdlJ5yPsg5LWEtv89hiSNx4nUbUhdpsuU86ulivNmUKj5N-3OZ1epIH46QE5rV1jvNAGAYr6w"
                  alt="BettaVerse breeding facility"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 flex items-center gap-4 rounded-3xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-md md:-bottom-8 md:-left-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4648d4]/10 text-[#4648d4]">
                  <span className="material-symbols-outlined text-[24px]">favorite</span>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#12101a]">500+</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#767586]">Happy Parents</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Keunggulan (Safe delivery diganti Health Guarantee) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: "verified", title: "Premium Quality", desc: "Every betta in our catalogue is hand-selected by experienced breeders for health, colour vibrancy, and fin quality." },
              { icon: "health_and_safety", title: "100% Health Guarantee", desc: "We ensure every betta is strictly quarantined and health-checked before leaving our facility so they arrive active and vibrant." },
              { icon: "support_agent", title: "Ongoing Support", desc: "Our team is always ready to help — from choosing the right betta to troubleshooting water quality issues." },
            ].map((val) => (
              <div key={val.title} className="group rounded-[24px] border border-[#f0eeff] bg-[#fafafe] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#4648d4]/30 hover:shadow-lg hover:shadow-[#4648d4]/5">
                <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#4648d4]/10 text-[#4648d4] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#4648d4] group-hover:text-white">
                  <span className="material-symbols-outlined text-[28px]">{val.icon}</span>
                </div>
                <div>
                  <h3 className="mb-2 text-[17px] font-bold text-[#12101a]">{val.title}</h3>
                  <p className="text-[14px] leading-relaxed text-[#464554]">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "50+", label: "Betta Varieties" },
              { value: "500+", label: "Orders Delivered" },
              { value: "4.9★", label: "Average Rating" },
              { value: "5 yrs", label: "Breeding Experience" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[24px] bg-[#2d3133] p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2d3133]/20">
                <p className="text-3xl font-extrabold text-white md:text-4xl">{stat.value}</p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-white/60">{stat.label}</p>
              </div>
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
