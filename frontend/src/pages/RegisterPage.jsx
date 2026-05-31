import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuARvvv3SWJ3CGq102_yVrlu6EUuJkTXrSKRE7Oex3bPMb0nmHxVFX3woHpT89azioybSUyElkqnEUR05FMXkWPC0ulJVglVIUVk3wLvB4gkQcx4lk-2YMydwlZGrkB7HBGyAp-pv5z7ogj0zgWHD31-46qHMDCia8DWw3AY1aoNn7PA9F3ARUgg44JCFsYpzsaGYahReGcOMid61DRMtnhMsPljZRUT4DHpbRBx2BzI2Gos10SLOV6YHUXu1ezOrxu_Zqx8Kf4Jig";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);

    if (!result.success) {
      setError(result.error);
    } else {
      window.location.href = "/";
    }

    setLoading(false);
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center p-4 md:p-8"
      style={{ 
        backgroundColor: "#f4f7f9", 
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" 
      }}
    >
      {/* MAIN CONTAINER */}
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* SISI KIRI: Gambar */}
        <div className="hidden md:block md:w-1/2 relative bg-[#0a0e2e]">
          <img 
            src={logoUrl} 
            alt="BettaVerse Showcase" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e2e]/90 via-[#0a0e2e]/20 to-transparent" />
          
          <div className="absolute bottom-12 left-0 right-0 text-center px-8">
            <h1 className="text-3xl font-black tracking-tight mb-2 text-[#4b83ff]">BettaVerse</h1>
            <p className="text-xs text-[#8aa8d8] tracking-wide uppercase">
              Join the Elite Betta Community
            </p>
          </div>
        </div>

        {/* SISI KANAN: Form Register */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            
            {/* Header Form */}
            <div className="text-center md:text-left mb-6">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-14 h-14 rounded-full object-cover mx-auto mb-4 md:hidden shadow-md border border-gray-100"
              />
              <h2 className="tracking-tight text-3xl font-black text-[#0f1a4a]">
                Buat Akun Baru
              </h2>
              <p className="mt-1.5 text-sm text-[#64748b]">
                Bergabunglah bersama kami hari ini
              </p>
            </div>

            {error && (
              <div 
                className="p-3 rounded-lg mb-4 text-xs text-center border"
                style={{ backgroundColor: "#fef2f2", borderColor: "#fca5a5", color: "#b91c1c" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block mb-1 text-xs font-bold tracking-wider text-[#3b5af5]">
                  NAMA LENGKAP
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all duration-200 border border-[#cbd5e1]"
                  style={{ color: "#0f1a4a", fontSize: "0.9rem" }}
                  onFocus={(e) => { 
                    e.target.style.borderColor = "#3b5af5"; 
                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 90, 245, 0.08)";
                  }}
                  onBlur={(e) => { 
                    e.target.style.borderColor = "#cbd5e1"; 
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold tracking-wider text-[#3b5af5]">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all duration-200 border border-[#cbd5e1]"
                  style={{ color: "#0f1a4a", fontSize: "0.9rem" }}
                  onFocus={(e) => { 
                    e.target.style.borderColor = "#3b5af5"; 
                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 90, 245, 0.08)";
                  }}
                  onBlur={(e) => { 
                    e.target.style.borderColor = "#cbd5e1"; 
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold tracking-wider text-[#3b5af5]">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all duration-200 border border-[#cbd5e1]"
                  style={{ color: "#0f1a4a", fontSize: "0.9rem" }}
                  onFocus={(e) => { 
                    e.target.style.borderColor = "#3b5af5"; 
                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 90, 245, 0.08)";
                  }}
                  onBlur={(e) => { 
                    e.target.style.borderColor = "#cbd5e1"; 
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold tracking-wider text-[#3b5af5]">
                  KONFIRMASI PASSWORD
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all duration-200 border border-[#cbd5e1]"
                  style={{ color: "#0f1a4a", fontSize: "0.9rem" }}
                  onFocus={(e) => { 
                    e.target.style.borderColor = "#3b5af5"; 
                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 90, 245, 0.08)";
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
                className="w-full py-3 mt-3 rounded-xl font-bold text-white transition-all duration-200"
                style={{
                  background: "#3b5af5", 
                  fontSize: "0.95rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(59, 90, 245, 0.15)",
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => { if(!loading) e.currentTarget.style.background = "#4b83ff"; }}
                onMouseLeave={(e) => { if(!loading) e.currentTarget.style.background = "#3b5af5"; }}
              >
                {loading ? "Mendaftar..." : "Daftar Sekarang"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}