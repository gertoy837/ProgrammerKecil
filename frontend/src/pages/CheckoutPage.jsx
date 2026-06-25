import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { checkoutCart } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

  const cartItems = cart?.items || [];
  const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const totalPrice = Number(cart?.totalPrice || 0);

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const apiHost = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
  const formatPrice = (value) => currencyFormatter.format(Number(value || 0));

  const handleCheckout = async () => {
    if (isCheckingOut || cartItems.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError(null);
    setCheckoutSuccess(null);

    try {
      const response = await checkoutCart();
      setCheckoutSuccess(response.data.order);
      await fetchCart();
    } catch (error) {
      setCheckoutError(error.response?.data?.message || "Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col font-sans">
        <Navbar />
        <main className="mx-auto flex flex-1 w-full max-w-3xl items-center justify-center px-4 py-12 text-center">
          <div className="rounded-4xl border border-slate-100 bg-white p-8 shadow-sm md:p-12 w-full">
            <span className="material-symbols-outlined mb-4 text-5xl text-[#4648d4]">lock</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Checkout requires login</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Silakan login terlebih dahulu untuk melanjutkan ke halaman pembayaran.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-full bg-[#4648d4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3b3dbb]"
              >
                Login
              </button>
              <Link
                to="/cart"
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#4648d4] hover:text-[#4648d4]"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-10 flex-1 w-full">
        <div className="mb-8 rounded-4xl border border-white/60 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#767586]">Checkout</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">Review & Payment</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Periksa kembali detail pesanan sebelum melanjutkan ke proses pembayaran.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <span className="material-symbols-outlined mb-4 text-5xl text-slate-300">shopping_basket</span>
              <h2 className="text-2xl font-extrabold text-slate-900">Cart is empty</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Tidak ada item untuk dilanjutkan ke pembayaran.
              </p>
              <Link
                to="/products"
                className="mt-8 inline-flex rounded-full bg-[#4648d4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3b3dbb]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const imageUrl = item.product?.image ? `${apiHost}${item.product.image}` : null;
              
              return (
                <article key={item.id} className="rounded-[28px] border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail Image */}
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.product?.name || "Cart item"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-3xl text-slate-300">image_not_supported</span>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#767586]">
                          {item.product?.categoryName || "Betta Fish"}
                        </p>
                        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 line-clamp-1">
                          {item.product?.name || "Unknown Product"}
                        </h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">Qty {item.quantity}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#767586]">Subtotal</p>
                      <p className="mt-1 text-xl font-extrabold text-[#4648d4]">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <aside className="h-fit rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#767586]">Summary</p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">Payment Overview</h2>

          <div className="mt-6 space-y-4 rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Items</span>
              <span className="font-bold text-slate-900">{itemCount}</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="text-2xl font-extrabold text-[#4648d4]">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {checkoutError ? (
            <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {checkoutError}
            </div>
          ) : null}

          {checkoutSuccess ? (
            <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              Pesanan berhasil dibuat. Order ID: <strong>{checkoutSuccess.id}</strong>
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut || cartItems.length === 0}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#191c1e] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            {isCheckingOut ? "Processing…" : "Continue to Payment"}
          </button>

          <Link
            to="/cart"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#4648d4] hover:text-[#4648d4]"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Cart
          </Link>
        </aside>
      </div>
      </main>
      <Footer />
    </div>
  );
}