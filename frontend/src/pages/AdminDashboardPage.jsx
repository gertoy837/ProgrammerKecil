import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProduct } from "../contexts/ProductContext";
import AdminLayout from "../components/AdminLayout";
import apiClient from "../utils/api";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { products, categories, fetchAllProducts, fetchCategories, loading: productsLoading } = useProduct();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") { navigate("/"); return; }
    
    fetchAllProducts();
    fetchCategories();

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const response = await apiClient.get("/orders/all");
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
    setMounted(true);
  }, [authLoading, user, navigate, fetchAllProducts, fetchCategories]);

  if (authLoading) return null;

  const totalProducts = products.length;
  const totalCategories = categories.length;

  // Calculate real sales & order counts from API data
  const totalSales = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const totalOrders = orders.length;

  // Get initials for user avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <AdminLayout>
      <div className={`transition-all duration-300 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        
        {/* Breadcrumbs / Heading */}
        <div className="mb-8">
          <p className="text-on-surface-variant font-semibold text-sm mb-1">Overview</p>
          <h3 className="text-2xl font-extrabold text-on-surface">Admin Dashboard</h3>
        </div>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Stat Card: Total Sales */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-container/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="text-green-500 font-bold text-sm flex items-center">Active</span>
            </div>
            <p className="text-on-surface-variant font-semibold text-sm">Total Revenue</p>
            <h4 className="text-xl font-bold text-on-surface mt-1">
              {ordersLoading ? "..." : `Rp ${totalSales.toLocaleString("id-ID")}`}
            </h4>
          </div>

          {/* Stat Card: New Orders */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-secondary-container/10 text-secondary rounded-2xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
              <span className="text-green-500 font-bold text-sm flex items-center">Realtime</span>
            </div>
            <p className="text-on-surface-variant font-semibold text-sm">Total Orders</p>
            <h4 className="text-xl font-bold text-on-surface mt-1">
              {ordersLoading ? "..." : totalOrders}
            </h4>
          </div>

          {/* Stat Card: Total Products */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-tertiary-container/10 text-tertiary rounded-2xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">settop_component</span>
              </div>
              <span className="text-on-surface-variant font-bold text-sm flex items-center">Catalog</span>
            </div>
            <p className="text-on-surface-variant font-semibold text-sm">Total Products</p>
            <h4 className="text-xl font-bold text-on-surface mt-1">
              {productsLoading ? "..." : totalProducts}
            </h4>
          </div>

          {/* Stat Card: Total Categories */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-fixed/30 text-on-primary-fixed-variant rounded-2xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">category</span>
              </div>
              <span className="text-green-500 font-bold text-sm flex items-center">Active</span>
            </div>
            <p className="text-on-surface-variant font-semibold text-sm">Total Categories</p>
            <h4 className="text-xl font-bold text-on-surface mt-1">
              {productsLoading ? "..." : totalCategories}
            </h4>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10 overflow-hidden">
          <div className="p-8 flex justify-between items-center border-b border-outline-variant/20">
            <h5 className="text-lg font-bold text-on-surface">Recent Orders</h5>
            <span className="text-xs font-bold text-on-surface-variant/70">
              Showing {orders.slice(0, 5).length} of {orders.length} transactions
            </span>
          </div>
          <div className="overflow-x-auto">
            {ordersLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-semibold text-on-surface-variant">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">receipt_long</span>
                <p className="text-sm font-semibold text-on-surface-variant">No orders placed yet.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-low text-on-surface-variant font-semibold">
                  <tr>
                    <th className="px-8 py-4 uppercase tracking-wider text-xs">Order ID</th>
                    <th className="px-8 py-4 uppercase tracking-wider text-xs">Customer</th>
                    <th className="px-8 py-4 uppercase tracking-wider text-xs">Products</th>
                    <th className="px-8 py-4 uppercase tracking-wider text-xs">Date</th>
                    <th className="px-8 py-4 uppercase tracking-wider text-xs">Status</th>
                    <th className="px-8 py-4 uppercase tracking-wider text-xs">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                  {orders.slice(0, 5).map((order) => {
                    const orderDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    // Construct product list summary string
                    const productsSummary = order.items?.map(i => `${i.productName} (x${i.quantity})`).join(", ") || "No items";

                    return (
                      <tr key={order.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-8 py-5 font-bold text-primary">#BV-{order.id}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                              {getInitials(order.userName)}
                            </div>
                            <span className="font-semibold">{order.userName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-on-surface-variant line-clamp-1 max-w-xs md:max-w-md mt-2">
                          {productsSummary}
                        </td>
                        <td className="px-8 py-5 text-on-surface-variant">{orderDate}</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase">
                            Finished
                          </span>
                        </td>
                        <td className="px-8 py-5 font-bold">
                          Rp {(order.totalPrice || 0).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
