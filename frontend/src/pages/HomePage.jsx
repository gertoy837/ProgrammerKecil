import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useProduct } from "../contexts/ProductContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Data akan diambil dari backend via ProductContext
// kategori, produk, dan rekomendasi diturunkan dari daftar yang diambil.

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

  // Mengambil produk saat komponen pertama kali dirender
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const apiHost = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  ).replace(/\/api\/?$/, "");

  // === PERUBAHAN: Logika memotong data produk ===
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Mengambil kategori unik dari produk dan menetapkan ikon
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

  // Daftar rekomendasi sederhana – ambil 4 produk pertama
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
      setNotification({ type: "success", message: `${productTitle} berhasil ditambahkan ke keranjang!` });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ type: "error", message: result.error || "Gagal menambahkan ke keranjang" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Menampilkan spinner loading saat mengambil produk
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-[#4648d4] border-t-transparent"></div>
          <p className="animate-pulse text-sm font-semibold text-slate-500">Memuat katalog BettaVerse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#191c1e]">
      {notification && (
        <div
          className={`fixed left-1/2 top-24 z-40 -translate-x-1/2 rounded-lg px-6 py-3 text-white shadow-lg transition-all ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}
      <Navbar />

      <header id="home" className="h-150 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Ikan Cupang BettaVerse"
            className="h-full w-full scale-105 object-cover object-center"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJoCDI3Hg3SDfZGWWSvRVeoy3goEHbG2SLGgJNeK5ZgXT_NpmvyCtIADyVblkSGrOGex26AEeT8dJDo1sHteVqaaOSCvMszoqHCRtHXF3m3m5M8xr9xI4vCjStBKjWLk2cCEA60VMxspCp2DqMdQrQOiAi12y79fMaZuKl4it3HT6HX6vBzEMTRHijk0-Ev5VNZIdlJ5yPsg5LWEtv89hiSNx4nUbUhdpsuU86ulivNmUKj5N-3OZ1epIH46QE5rV1jvNAGAYr6w"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 px-4 text-center text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-white/75">Kualitas Budi Daya Terbaik</p>
          <h1 className="mx-auto max-w-6xl text-[clamp(64px,15vw,220px)] font-extrabold uppercase leading-[0.9] tracking-tighter text-white [text-shadow:0_0_1px_rgba(255,255,255,0.3)]">
            BettaVerse
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
            Tempat bertemunya keajaiban biologis dan keunggulan budi daya.
          </p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="mt-8 rounded-full bg-[#4648d4] px-10 py-4 text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-[#2f2ebe]"
          >
            Jelajahi Koleksi Kami
          </button>
        </div>
      </header>

      <main id="shop" className="mx-auto mt-8 max-w-7xl px-4 py-8 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-6 rounded-[28px] border border-white/50 bg-white p-8 shadow-sm md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#12101a]">Menyediakan Semua Kebutuhan Anda</h2>
            <p className="mt-1 text-[#464554]">Temukan koleksi cupang premium yang dipilih khusus untuk Anda.</p>
          </div>
          <div className="flex-1 md:ml-10 md:max-w-xl">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-[#767586]">search</span>
              <input
                className="w-full rounded-2xl border-none bg-[#f2f4f6] py-4 pl-12 pr-32 text-sm outline-none ring-0 focus:ring-2 focus:ring-[#4648d4]/20"
                placeholder="Cari di BettaVerse..."
                type="text"
              />
              <button
                type="button"
                className="absolute right-2 rounded-xl bg-[#2d3133] px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-black"
              >
                Cari
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <aside className="space-y-8 lg:col-span-3">
            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-2xl font-semibold text-[#12101a]">Kategori</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="flex w-full items-center justify-between rounded-2xl bg-[#4648d4]/10 p-4 font-bold text-[#4648d4]"
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined">inventory_2</span>
                    Semua Produk
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
                        <span className="ml-auto rounded bg-[#4648d4]/20 px-2 py-0.5 text-xs">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-sm" id="tips">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#767586]">Filter Berdasarkan</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["Produk Baru", false],
                  ["Terlaris", true],
                  ["Diskon", false],
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
              {currentProducts.map((product) => {
                const productImageUrl = product.image ? `${apiHost}${product.image}` : null;

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-4xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                  >
                    <div className="relative m-3 aspect-4/5 overflow-hidden rounded-3xl bg-[#f2f4f6]">
                      <div className="absolute right-4 top-4 z-10">
                        <ProductBadge className={product.category?.name === "Rare" ? "bg-[#6b38d4] text-white" : "bg-white/90 text-[#191c1e]"}>
                          {product.category?.name === "Rare" ? "Langka" : (product.category?.name || "")}
                        </ProductBadge>
                      </div>
                      {productImageUrl ? (
                        <img
                          alt={product.name}
                          src={productImageUrl}
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="h-full w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm uppercase text-slate-400">
                          Gambar tidak tersedia
                        </div>
                      )}
                    </div>
                  <div className="px-6 pb-6 pt-2 text-left">
                    <div className="mb-2 flex items-center justify-between">
                      <h4
                        className="cursor-pointer text-lg font-semibold text-[#12101a]"
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
                        className="flex-1 rounded-2xl border border-[#c7c4d7]/50 py-3 text-sm font-semibold text-[#191c1e] transition-colors hover:bg-[#f2f4f6] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {addingToCart === product.id ? "Menambahkan..." : "Keranjang"}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="flex-1 rounded-2xl bg-[#2d3133] py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
                      >
                        Beli Sekarang
                      </button>
                    </div>
                  </div>
                </article>
          )       })}
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
              <h2 className="text-3xl font-bold tracking-tight text-[#12101a]">Rekomendasi dari Kami</h2>
              <p className="mt-2 text-[#464554]">Dipilih secara khusus oleh ahli budi daya kami untuk Anda.</p>
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
            {recommendations.map((item) => {
              const recommendationImageUrl = item.image ? `${apiHost}${item.image}` : null;

              return (
                <article key={item.id} className="flex w-80 shrink-0 snap-start flex-col rounded-4xl bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                  <div className="mb-4 aspect-square w-full overflow-hidden rounded-3xl bg-[#f2f4f6]">
                    {recommendationImageUrl ? (
                      <img
                        alt={item.name}
                        src={recommendationImageUrl}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm uppercase text-slate-400">
                        Gambar tidak tersedia
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-2 text-left">
                  <h4 className="truncate text-lg font-semibold text-[#12101a]">{item.name}</h4>
                  <span className="font-bold text-[#4648d4]">Rp {(item.price || 0).toLocaleString("id-ID")}</span>
                  <button onClick={() => handleAddToCart(item.id, item.name)} className="mt-auto w-full rounded-2xl bg-[#2d3133] py-3 text-sm font-semibold text-white">
                    Tambah ke Keranjang
                  </button>
                </div>
              </article>
            )})}
          </div>
        </div>
      </section>

      {/* ── Tips Perawatan ── */}
      <section id="care" className="mx-auto max-w-7xl px-4 py-16 md:px-10 md:py-24">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="mb-3 rounded-full bg-[#4648d4]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#4648d4]">
            Panduan Ahli
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#12101a] md:text-4xl">
            Dasar Perawatan Cupang
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#464554]">
            Jaga ikan cupang Anda tetap cerah dan sehat dengan tips sederhana dan terbukti dari para ahli budi daya kami.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "water_drop", color: "bg-blue-50 text-blue-600",
              title: "Kualitas Air",
              desc: "Jaga suhu di 24–28°C & pH 6.5–7.5. Ganti 25% air setiap minggu untuk mencegah penumpukan amonia."
            },
            {
              icon: "restaurant", color: "bg-orange-50 text-orange-600",
              title: "Jadwal Makan",
              desc: "Beri makan porsi kecil 2–3 kali sehari (tinggi protein). Buang sisa makanan setelah 5 menit."
            },
            {
              icon: "home", color: "bg-purple-50 text-purple-600",
              title: "Persiapan Akuarium",
              desc: "Gunakan akuarium minimal 10L dengan arus tenang. Sisakan ruang di permukaan agar ikan bisa bernapas."
            },
            {
              icon: "healing", color: "bg-red-50 text-red-600",
              title: "Cek Kesehatan",
              desc: "Perhatikan jika sirip menguncup atau warna memucat. Segera obati busuk sirip atau bintik putih (ich) dengan obat yang tepat."
            },
            {
              icon: "wb_sunny", color: "bg-yellow-50 text-yellow-600",
              title: "Pencahayaan & Istirahat",
              desc: "Beri cahaya 8–10 jam sehari. Hindari sinar matahari langsung dan pastikan ruangan gelap total di malam hari."
            },
            {
              icon: "diversity_1", color: "bg-green-50 text-green-600",
              title: "Teman Akuarium",
              desc: "Cupang jantan sangat teritorial. Jangan pernah menggabungkan dua jantan. Siput atau ikan pembersih dasar masih aman."
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
            { value: "24–28°C", label: "Suhu Ideal" },
            { value: "6.5–7.5", label: "Rentang pH" },
            { value: "10+ L", label: "Min. Akuarium" },
            { value: "3–5 Thn", label: "Masa Hidup" },
          ].map((fact) => (
            <div key={fact.label} className="text-center">
              <p className="text-2xl font-black tracking-tight text-[#4648d4] md:text-3xl">{fact.value}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#767586]">{fact.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tentang Kami ── */}
      <section id="about" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          {/* Bagian Atas: Cerita & Gambar */}
          <div className="mb-16 grid gap-10 md:grid-cols-2 md:items-center">
            <div className="order-2 md:order-1">
              <span className="mb-4 inline-block rounded-full bg-[#4648d4]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#4648d4]">
                Cerita Kami
              </span>
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#12101a] md:text-5xl">
                Kecintaan pada Cupang.<br />Dibangun dengan Tujuan.
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-[#464554]">
                BettaVerse lahir dari kecintaan yang mendalam terhadap ikan cupang dan keinginan untuk menghubungkan pembudi daya berdedikasi dengan para penggemar sejati. Kami percaya setiap cupang berhak mendapatkan tempat yang memahami keindahan dan biologinya.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-[#464554]">
                Dari awal mula kami melakukan budi daya lokal hingga membangun katalog lengkap berisi spesimen premium, misi kami selalu sama: <strong>menjadikan ikan cupang berkualitas dapat diakses oleh siapa saja.</strong>
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="rounded-full bg-[#4648d4] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4648d4]/30 transition-all hover:-translate-y-1 hover:bg-[#2f2ebe]"
                >
                  Beli Sekarang
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full border-2 border-[#f2f4f6] bg-transparent px-8 py-3.5 text-sm font-bold text-[#12101a] transition-all hover:border-[#c7c4d7] hover:bg-[#f2f4f6]"
                >
                  Tips Perawatan
                </button>
              </div>
            </div>

            <div className="relative order-1 md:order-2">
              <div className="aspect-[4/3] overflow-hidden rounded-[32px] bg-[#f2f4f6] shadow-2xl shadow-black/5">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJoCDI3Hg3SDfZGWWSvRVeoy3goEHbG2SLGgJNeK5ZgXT_NpmvyCtIADyVblkSGrOGex26AEeT8dJDo1sHteVqaaOSCvMszoqHCRtHXF3m3m5M8xr9xI4vCjStBKjWLk2cCEA60VMxspCp2DqMdQrQOiAi12y79fMaZuKl4it3HT6HX6vBzEMTRHijk0-Ev5VNZIdlJ5yPsg5LWEtv89hiSNx4nUbUhdpsuU86ulivNmUKj5N-3OZ1epIH46QE5rV1jvNAGAYr6w"
                  alt="Fasilitas budidaya BettaVerse"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 flex items-center gap-4 rounded-3xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-md md:-bottom-8 md:-left-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4648d4]/10 text-[#4648d4]">
                  <span className="material-symbols-outlined text-[24px]">favorite</span>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#12101a]">500+</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#767586]">Pemilik Puas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Keunggulan (Garansi Kesehatan) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: "verified", title: "Kualitas Premium", desc: "Setiap cupang di katalog kami dipilih langsung oleh ahli berdasarkan kesehatan, kecerahan warna, dan kualitas sirip." },
              { icon: "health_and_safety", title: "Garansi Kesehatan 100%", desc: "Kami memastikan setiap ikan dikarantina secara ketat dan dicek kesehatannya sebelum dikirim, agar sampai dengan aktif dan sehat." },
              { icon: "support_agent", title: "Dukungan Penuh", desc: "Tim kami selalu siap membantu — mulai dari tahap memilih cupang yang tepat hingga menangani masalah kualitas air akuarium." },
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
              { value: "50+", label: "Varietas Cupang" },
              { value: "500+", label: "Pesanan Terkirim" },
              { value: "4.9★", label: "Rata-Rata Ulasan" },
              { value: "5 Thn", label: "Pengalaman Budi Daya" },
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
              <h2 className="text-4xl font-extrabold leading-tight">Siap Mendapatkan Koleksi Terbaru Kami?</h2>
              <div className="mt-6 flex max-w-md items-center rounded-full bg-white/10 p-2 backdrop-blur-md">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="w-full rounded-full border-none bg-transparent px-6 py-3 text-white outline-none placeholder:text-white/50"
                />
                <button type="button" className="rounded-full bg-white px-8 py-3 font-bold text-[#191c1e] transition-colors hover:bg-[#4648d4] hover:text-white">
                  Kirim
                </button>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="mb-2 text-lg font-bold">BettaVerse Sesuai Kebutuhan Anda</p>
              <p className="text-white/65">
                Kami mendengarkan kebutuhan Anda, menentukan pilihan terbaik, dan siap merekomendasikan koleksi premium yang paling pas untuk akuarium Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}