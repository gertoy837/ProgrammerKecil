import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = [
  { name: "Halfmoon", icon: "water_drop" },
  { name: "Plakat", icon: "waves" },
  { name: "Crowntail", icon: "auto_awesome" },
  { name: "Rosetail", icon: "filter_vintage" },
];

const products = [
  {
    title: "Royal Red Halfmoon",
    price: "$45.00",
    rating: "4.9",
    reviews: "1.2k Reviews",
    badge: "Halfmoon",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDgHSznfBrQNQYJh6fHiiySWtWptJWnOykXK5Pg3JDz--_OcG1UL2pt2FrRYPs2CXNr4r6-rnekUOgyuSlzI5AKMmoaefYW0LRKLu3odKQKXA8xw7aPeaZpHcDj7xTs2XpZGKXhIKRKCwhKmF70YeRAlir7bpxQY-kHhi2VKvBx3XYXT9EZ-jUxWXYHSdsRspOxejx9Tvmwre-JEL1jaSpzRD3wR1C5lmprY1oMVct4UEi5DNtAZLLE0Nu5ZC55jUgIcGB73CNLEw",
  },
  {
    title: "Galaxy Koi Plakat",
    price: "$78.00",
    rating: "5.0",
    reviews: "850 Reviews",
    badge: "Rare",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ5o3FEmGDvg1XSLRl8mbgkpq5jYoBbwH9OLepDEMhBz8nni4mT6EDgF-Qb1vJxjAptq6t6bAY6dYXq-GEr6vjhso4pZKoj4uqedEHqON5a0ACOG2NNdEWb8B845iFfL46atLX8r8-N3c16mRXTSCcEe0Yz3FzJdhLx_v6bFt4lJNUQoqTk03XHFFonGvZKFpJoFPOOpP83xrUWTR6a8PJlxpdNm6PCaEDUdlmvzJrburHLddAUzDzwUAz0zTuLkR2Pw1_vTvphg",
  },
  {
    title: "Midnight Crowntail",
    price: "$32.00",
    rating: "4.8",
    reviews: "2.4k Reviews",
    badge: "Crowntail",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARvvv3SWJ3CGq102_yVrlu6EUuJkTXrSKRE7Oex3bPMb0nmHxVFX3woHpT89azioybSUyElkqnEUR05FMXkWPC0ulJVglVIUVk3wLvB4gkQcx4lk-2YMydwlZGrkB7HBGyAp-pv5z7ogj0zgWHD31-46qHMDCia8DWw3AY1aoNn7PA9F3ARUgg44JCFsYpzsaGYahReGcOMid61DRMtnhMsPljZRUT4DHpbRBx2BzI2Gos10SLOV6YHUXu1ezOrxu_Zqx8Kf4Jig",
  },
];

const recommendations = [
  {
    title: "Super Gold Halfmoon",
    price: "$120.00",
    rating: "5.0",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpbOUhkg4csU9enkSEubyEdk6Rr5_K4tma5sbn-u-fDhXxFBgVcNzlT4utX-lM1D4VE9D0IXEK6IkccvSyEZUo-UaVSf3pSQzjz9FFU9oI06nntgjn-EziM_U6xp1O7G62u0_S2hHqbekUjlSdEXapBGzQ2IRRnGGkaFN0_nn0HdWkvAMGlKg7w0zKtx_XyKnepI10r53BJEPHJZdZPriEZTkL5L05yT6TC3DOs5-dDObzExlsOo_ZUQNdTstuqK5G7Zy4jPfVlA",
  },
  {
    title: "Platinum Plakat",
    price: "$85.00",
    rating: "4.9",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAAs8T7VrAfAMy1DMezkclsvMGHKTPfPERZ515cm3ueUX_fXymL36YgjhP_529o2eDzOb_lZtxoOF1Wfea0C2pzYpWu466qxtosVC7i1BHMIxqT3T81snPrGX37bSNWTqtOvc8D7ZlcgNtu20A89d16OacLaL1ft27xuA52BzmLym0tRNrxOnLdtT1v4AkQcNKe445bZIeO2m-ILe-P5_G52mJntr7cGiERULCiEE2wn1dmEYbE13It1c9P78cAoLWasSJdAuRSHA",
  },
  {
    title: "Fancy Marble",
    price: "$95.00",
    rating: "4.7",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOUAZ3EGq4ghIKCqs-eOchfHlzsJw3CdlivGjYNbPBNVGm12kCKMkY-tanEmsWOzNcv_0QL9iUZu9LrUCT6clvS0SJdESOO1AxxfqkppRqcBxAeu1bfK__CLHOMqk8bmFm8BEE8TMiiWekuDJOyMm9IyFau2G4k__TpREdIkdVfhRIDnCbryO9EGhx1MRmax9n4IhOtXDq5VWa1038Qlbm1wcSsf-cK7kVIZIN2qlA2uQKPwrhDEWDrhFg3ZKTHfmc_Ku1NESw2Q",
  },
  {
    title: "Black Orchid Crowntail",
    price: "$65.00",
    rating: "5.0",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjb3ijvInuKhvczOEx6uzOTqF9zvIroQAsmqqvjn1diphyHrLA7SIRLOHkjiVJOo3V0M6hgqTP_ZjsBsaRn-ssiAyl-mfmL594cRzVzSTV7-tqsAeZGx6y-E_yzN5eQRbt66a2FcHiYQlnQK8hmqy0AchvPcurZsJLE_kmWstCo3k52VlUVrqvKYa_BzKFhPmI6XxDvel6Y_w6vJlCTW9zV8e0D4XlaKjKufLIAEjBoswZG9fi6YYDqMjKGUQ8b7NEBLDw81_ntA",
  },
];

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
  return (
    <div className="min-h-screen text-[#191c1e]">
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
                Search
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
                  <span className="rounded-full bg-[#4648d4] px-2 py-0.5 text-xs text-white">82</span>
                </button>
                <div className="pl-4">
                  {categories.map((category) => (
                    <a
                      key={category.name}
                      href="#"
                      className="flex items-center gap-3 rounded-xl p-3 text-[#464554] transition-colors hover:text-[#4648d4]"
                    >
                      <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                      {category.name}
                    </a>
                  ))}
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
                  key={product.title}
                  className="group overflow-hidden rounded-4xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative m-3 aspect-4/5 overflow-hidden rounded-3xl bg-[#f2f4f6]">
                    <div className="absolute right-4 top-4 z-10">
                      <ProductBadge className={product.badge === "Rare" ? "bg-[#6b38d4] text-white" : "bg-white/90 text-[#191c1e]"}>
                        {product.badge}
                      </ProductBadge>
                    </div>
                    <img
                      alt={product.title}
                      src={product.image}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="px-6 pb-6 pt-2 text-left">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-[#12101a]">{product.title}</h4>
                      <span className="font-bold text-[#4648d4]">{product.price}</span>
                    </div>
                    <div className="mb-6 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px] text-[#b90538]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="text-sm font-semibold text-[#12101a]">{product.rating}</span>
                      <span className="text-xs text-[#767586]">({product.reviews})</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="flex-1 rounded-2xl border border-[#c7c4d7]/50 py-3 text-sm font-semibold text-[#191c1e] transition-colors hover:bg-[#f2f4f6]"
                      >
                        Add to Cart
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
              <article key={item.title} className="min-w-80 snap-start rounded-4xl bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <div className="mb-4 overflow-hidden rounded-3xl">
                  <img alt={item.title} src={item.image} className="h-full w-full object-cover" />
                </div>
                <div className="px-2 text-left">
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-[#12101a]">{item.title}</h4>
                    <span className="font-bold text-[#4648d4]">{item.price}</span>
                  </div>
                  <div className="mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#b90538]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="text-sm font-semibold text-[#12101a]">{item.rating}</span>
                  </div>
                  <button type="button" className="w-full rounded-2xl bg-[#2d3133] py-3 text-sm font-semibold text-white transition-colors hover:bg-black">
                    Add to cart
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
