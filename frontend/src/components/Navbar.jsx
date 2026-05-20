export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-10">
        <div className="flex items-center gap-10">
          <a href="#home" className="text-2xl font-extrabold tracking-tight text-[#4648d4]">
            BettaVerse
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#home" className="border-b-2 border-[#4648d4] pb-1 font-semibold text-[#4648d4]">
              Home
            </a>
            <a href="#shop" className="font-semibold text-[#464554] transition-colors hover:text-[#4648d4]">
              Shop
            </a>
            <a href="#tips" className="font-semibold text-[#464554] transition-colors hover:text-[#4648d4]">
              Care Tips
            </a>
            <a href="#about" className="font-semibold text-[#464554] transition-colors hover:text-[#4648d4]">
              About
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden items-center rounded-full border border-[#dfe3ea] bg-white px-4 py-2 lg:flex">
            <span className="material-symbols-outlined mr-2 text-[#767586]">search</span>
            <input
              type="text"
              placeholder="Search your Betta..."
              className="w-48 border-none bg-transparent text-sm outline-none"
            />
          </div>
          <button type="button" className="transition-transform active:scale-95">
            <span className="material-symbols-outlined text-[#464554]">account_circle</span>
          </button>
          <button type="button" className="relative transition-transform active:scale-95">
            <span className="material-symbols-outlined text-[#464554]">shopping_cart</span>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#b90538] text-[10px] font-bold text-white">
              2
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
