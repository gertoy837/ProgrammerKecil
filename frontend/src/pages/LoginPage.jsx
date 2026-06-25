import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const logoUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuARvvv3SWJ3CGq102_yVrlu6EUuJkTXrSKRE7Oex3bPMb0nmHxVFX3woHpT89azioybSUyElkqnEUR05FMXkWPC0ulJVglVIUVk3wLvB4gkQcx4lk-2YMydwlZGrkB7HBGyAp-pv5z7ogj0zgWHD31-46qHMDCia8DWw3AY1aoNn7PA9F3ARUgg44JCFsYpzsaGYahReGcOMid61DRMtnhMsPljZRUT4DHpbRBx2BzI2Gos10SLOV6YHUXu1ezOrxu_Zqx8Kf4Jig";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result = await login(email, password);

    console.log("LOGIN RESULT:", result);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);

    // Redirect berdasarkan role
    if (result.user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: "#f4f7f9", // Abu-abu sangat terang agar card putih lebih menonjol
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* MAIN CONTAINER: Satu Card besar yang menampung gambar & form */}
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* SISI KIRI: Gambar (Tinggi akan otomatis sejajar dengan form di kanan) */}
        <div className="hidden md:block md:w-1/2 relative bg-[#0a0e2e]">
          <img
            src={logoUrl}
            alt="BettaVerse Showcase"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Gradasi gelap di bagian bawah gambar agar teks terbaca */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e2e]/90 via-[#0a0e2e]/20 to-transparent" />

          <div className="absolute bottom-12 left-0 right-0 text-center px-8">
            <h1 className="text-3xl font-black tracking-tight mb-2 text-[#4b83ff]">
              BettaVerse
            </h1>
            <p className="text-xs text-[#8aa8d8] tracking-wide uppercase">
              Premium Genetics • Sustainable Breeding
            </p>
          </div>
        </div>

        {/* SISI KANAN: Form Login */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            {/* Header Form */}
            <div className="text-center md:text-left mb-8">
              <img
                src={logoUrl}
                alt="Logo"
                className="w-14 h-14 rounded-full object-cover mx-auto mb-4 md:hidden shadow-md border border-gray-100"
              />
              <h2 className="tracking-tight text-3xl font-black text-[#0f1a4a]">
                Selamat Datang
              </h2>
              <p className="mt-1.5 text-sm text-[#64748b]">
                Silakan masuk ke akun Anda
              </p>
            </div>

            {error && (
              <div
                className="p-3 rounded-lg mb-5 text-xs text-center border"
                style={{
                  backgroundColor: "#fef2f2",
                  borderColor: "#fca5a5",
                  color: "#b91c1c",
                }}
              >
                {error.split("\n").map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold tracking-wider text-[#3b5af5]">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 border border-[#cbd5e1]"
                  style={{ color: "#0f1a4a", fontSize: "0.95rem" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b5af5";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 90, 245, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#cbd5e1";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold tracking-wider text-[#3b5af5]">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 border border-[#cbd5e1]"
                  style={{ color: "#0f1a4a", fontSize: "0.95rem" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b5af5";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 90, 245, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#cbd5e1";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 rounded-xl font-bold text-white transition-all duration-200"
                style={{
                  background: "#3b5af5",
                  fontSize: "0.95rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(59, 90, 245, 0.15)",
                  opacity: loading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = "#4b83ff";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.background = "#3b5af5";
                }}
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>

              <span className="text-sm text-center block text-[#64748b] transition-colors pt-2">
                Belum punya akun?
                <Link
                  to="/register"
                  className="text-[#3b5af5] hover:underline ml-1 font-semibold"
                >
                  Daftar di sini
                </Link>
              </span>

              {/* SEPARATOR GARIS HALUS */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs tracking-widest">ATAU</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* TOMBOL KEMBALI KE BERANDA (DI BAWAH) */}
              <Link
                to="/"
                className="group w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[#64748b] border border-[#cbd5e1] hover:border-[#3b5af5] hover:text-[#3b5af5] bg-transparent hover:bg-[#3b5af5]/05 transition-all duration-200 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
                Kembali ke Beranda
              </Link>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}