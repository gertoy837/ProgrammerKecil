import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/70 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2 sm:px-5 py-4 md:px-10">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-[#4648d4]">
            BettaVerse
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link 
              to="/" 
              className={`pb-1 font-semibold ${location.pathname === '/' ? 'border-b-2 border-[#4648d4] text-[#4648d4]' : 'text-[#464554] transition-colors hover:text-[#4648d4]'}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`pb-1 font-semibold ${location.pathname.startsWith('/products') ? 'border-b-2 border-[#4648d4] text-[#4648d4]' : 'text-[#464554] transition-colors hover:text-[#4648d4]'}`}
            >
              Shop
            </Link>
            <Link to="/#tips" className="font-semibold text-[#464554] transition-colors hover:text-[#4648d4]">
              Care Tips
            </Link>
            <Link to="/#about" className="font-semibold text-[#464554] transition-colors hover:text-[#4648d4]">
              About
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
            className="rounded-full border border-transparent p-2 transition-transform hover:border-[#dfe3ea] hover:bg-white active:scale-95 md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="material-symbols-outlined text-[#464554]">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
              setIsUserMenuOpen((currentValue) => !currentValue);
              setIsMobileMenuOpen(false);
            }}
              className="flex items-center gap-2 rounded-full border border-transparent px-2 py-1 transition-transform hover:border-[#dfe3ea] hover:bg-white active:scale-95"
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
            >
              <span className="material-symbols-outlined text-[#464554]">account_circle</span>
              <span className="hidden text-sm font-semibold text-[#464554] sm:block">
                {user ? user.name : "Account"}
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#767586]">expand_more</span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-[#e8ebf2] bg-white shadow-[0_20px_60px_rgba(19,27,44,0.12)]">
                <div className="border-b border-[#eef1f6] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a8fa3]">User Menu</p>
                  <p className="mt-1 text-sm font-semibold text-[#1f2233]">{user ? user.name : "Guest"}</p>
                  <p className="text-xs text-[#767586]">{user ? user.email : "Silakan login untuk akses penuh"}</p>
                </div>

                <div className="py-2 text-sm">

                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-[#464554] transition-colors hover:bg-[#f6f7fc] hover:text-[#4648d4]"
                      >
                        <span className="material-symbols-outlined text-[20px]">login</span>
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-[#464554] transition-colors hover:bg-[#f6f7fc] hover:text-[#4648d4]"
                      >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Register
                      </Link>
                    </>
                  ) : (
                    <>
                      {user.role === "admin" && (
                        <Link
                          to="/admin/products/create"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-[#464554] transition-colors hover:bg-[#f6f7fc] hover:text-[#4648d4]"
                        >
                          <span className="material-symbols-outlined text-[20px]">add_box</span>
                          Create Product
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-[#b90538] transition-colors hover:bg-[#fff3f6]"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/cart"
            className="relative transition-transform active:scale-95"
            aria-label="Open cart"
          >
            <span className="material-symbols-outlined text-[#464554]">shopping_cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b90538] px-1 text-[10px] font-bold text-white">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      {isMobileMenuOpen && (
      <div className="absolute left-0 right-0 top-full flex flex-col border-b border-[#e8ebf2] bg-white px-6 py-4 shadow-xl lg:hidden">
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 font-semibold text-[#4648d4] border-b border-gray-50">
          Home
        </Link>
        <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-3 font-semibold text-[#464554] hover:text-[#4648d4] border-b border-gray-50">
          Shop
        </Link>
        <Link to="/#tips" onClick={() => setIsMobileMenuOpen(false)} className="py-3 font-semibold text-[#464554] hover:text-[#4648d4] border-b border-gray-50">
          Care Tips
        </Link>
        <Link to="/#about" onClick={() => setIsMobileMenuOpen(false)} className="py-3 font-semibold text-[#464554] hover:text-[#4648d4]">
          About
        </Link>
      </div>
    )}
    </nav>
  );
}
