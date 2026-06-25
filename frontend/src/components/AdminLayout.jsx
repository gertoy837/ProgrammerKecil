import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: "dashboard",
  },
  {
    label: "Categories",
    to: "/admin/categories",
    icon: "category",
  },
  {
    label: "Products",
    to: "/admin/products",
    icon: "inventory_2",
  },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-background min-h-screen text-on-surface">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-md text-primary"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar Shell ── */}
      <aside
        className={`h-screen w-64 fixed left-0 top-0 flex flex-col p-4 border-r border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-surface-container-lowest transition-transform duration-300 z-50 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="mb-10 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-primary">BettaVerse</h1>
            <p className="text-xs font-semibold text-on-surface-variant/70">Management Console</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to ||
              (item.to !== "/admin" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-primary-container text-on-primary-container font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Links */}
        <div className="pt-6 border-t border-outline-variant/20 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-xl"
          >
            <span className="material-symbols-outlined">storefront</span>
            <span className="text-sm font-semibold">View Store</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-fixed transition-colors rounded-xl text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="md:ml-64 min-h-screen flex flex-col">
        {/* Topbar Shell */}
        <header className="flex justify-end items-center w-full pl-8 pr-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 border-b border-outline-variant/20 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-on-surface">{user?.name || "Admin"}</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-primary/10 text-primary font-bold flex items-center justify-center">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-[1400px] w-full mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
