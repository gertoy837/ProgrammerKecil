import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function CartPage() {
  const { user } = useAuth();
  const { cart, loading, error, fetchCart, updateCartQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [clearingCart, setClearingCart] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const apiHost = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

  const formatPrice = (value) => currencyFormatter.format(Number(value || 0));

  const notify = (type, message) => {
    setFeedback({ type, message });
    window.clearTimeout(window.__cartPageFeedbackTimer);
    window.__cartPageFeedbackTimer = window.setTimeout(() => setFeedback(null), 3000);
  };

  const handleQuantityChange = async (item, nextQuantity) => {
    if (nextQuantity < 1) {
      return handleRemoveItem(item.id);
    }

    setActionLoadingId(item.id);
    const result = await updateCartQuantity(item.id, nextQuantity);
    setActionLoadingId(null);

    if (result.success) {
      notify("success", "Quantity updated");
    } else {
      notify("error", result.error || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    setActionLoadingId(cartItemId);
    const result = await removeFromCart(cartItemId);
    setActionLoadingId(null);

    if (result.success) {
      notify("success", "Item removed from cart");
    } else {
      notify("error", result.error || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    setClearingCart(true);
    const result = await clearCart();
    setClearingCart(false);

    if (result.success) {
      notify("success", "Cart cleared");
    } else {
      notify("error", result.error || "Failed to clear cart");
    }
  };

  const cartItems = cart?.items || [];
  const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-12 text-center">
        <div className="rounded-4xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
          <span className="material-symbols-outlined mb-4 text-5xl text-[#4648d4]">shopping_cart</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Your Cart is Locked</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Please sign in first to view your cart items and manage your selection.
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
              to="/products"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#4648d4] hover:text-[#4648d4]"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-10">
        <div className="animate-pulse rounded-4xl border border-slate-100 bg-white p-8 shadow-sm md:p-10">
          <div className="h-7 w-44 rounded-full bg-slate-100" />
          <div className="mt-3 h-4 w-80 max-w-full rounded-full bg-slate-100" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 rounded-2xl bg-slate-100" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-2/3 rounded-full bg-slate-100" />
                      <div className="h-4 w-1/2 rounded-full bg-slate-100" />
                      <div className="h-4 w-28 rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-72 rounded-[28px] bg-slate-50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-10">
      {feedback && (
        <div
          className={`fixed right-4 top-24 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold shadow-xl ${
            feedback.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {feedback.type === "success" ? "check_circle" : "error"}
          </span>
          {feedback.message}
        </div>
      )}

      <div className="mb-8 rounded-4xl border border-white/60 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#767586]">Cart</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">My Cart</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchCart}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#4648d4] hover:text-[#4648d4]"
            >
              Refresh Cart
            </button>
            <Link
              to="/products"
              className="rounded-full bg-[#4648d4] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3b3dbb]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!cartItems.length ? (
        <div className="rounded-4xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <span className="material-symbols-outlined mb-4 text-5xl text-slate-300">shopping_basket</span>
          <h2 className="text-2xl font-extrabold text-slate-900">Your cart is empty</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Your cart is empty. Browse our collection and add your favorite Betta today!
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex rounded-full bg-[#4648d4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3b3dbb]"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-4">
            {cartItems.map((item) => {
              const imageUrl = item.product?.image ? `${apiHost}${item.product.image}` : null;

              return (
                <article key={item.id} className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-slate-100">
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

                    <div className="flex-1">
                      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#767586]">{item.product?.categoryName || "Betta Fish"}</p>
                          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
                            {item.product?.name || "Unknown Product"}
                          </h2>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            {item.product?.description || "Detail produk tidak tersedia."}
                          </p>
                        </div>

                        <div className="text-left lg:text-right">
                          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#767586]">Subtotal</p>
                          <p className="mt-1 text-xl font-extrabold text-[#4648d4]">{formatPrice(item.subtotal)}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, Number(item.quantity || 1) - 1)}
                            disabled={actionLoadingId === item.id}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-colors hover:text-[#4648d4] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Decrease quantity"
                          >
                            <span className="material-symbols-outlined text-[20px]">remove</span>
                          </button>

                          <div className="min-w-14 text-center text-sm font-bold text-slate-900">
                            Qty {item.quantity}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, Number(item.quantity || 0) + 1)}
                            disabled={actionLoadingId === item.id}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-colors hover:text-[#4648d4] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Increase quantity"
                          >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm font-semibold text-slate-500">{formatPrice(item.product?.price)}</p>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={actionLoadingId === item.id}
                            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#767586]">Summary</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">Order Overview</h2>

            <div className="mt-6 space-y-4 rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Items</span>
                <span className="font-bold text-slate-900">{itemCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Distinct products</span>
                <span className="font-bold text-slate-900">{cartItems.length}</span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-slate-700">Total</span>
                <span className="text-2xl font-extrabold text-[#4648d4]">{formatPrice(cart?.totalPrice)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearCart}
              disabled={clearingCart}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#191c1e] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              {clearingCart ? "Clearing..." : "Clear Cart"}
            </button>

            <Link
              to="/checkout"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#4648d4] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3b3dbb]"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
