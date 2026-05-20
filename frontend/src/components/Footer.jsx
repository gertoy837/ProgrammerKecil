export default function Footer() {
  return (
    <footer
      id="about"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0e2e 0%, #0f1a4a 40%, #0d2360 70%, #0a1a4f 100%)",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Decorative background orbs */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(70,72,212,0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          right: "-60px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56,182,255,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(99,130,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,130,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* Main grid */}
      <div
        className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-4 md:px-12"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Brand column */}
        <div className="space-y-6">
          <a
            href="#home"
            style={{
              display: "inline-block",
              fontSize: "1.75rem",
              fontWeight: "900",
              letterSpacing: "-0.02em",
              color: "#4b83ff",
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              textDecoration: "none",
            }}
          >
            BettaVerse
          </a>
          <p
            style={{
              maxWidth: "220px",
              color: "#8aa8d8",
              fontSize: "0.92rem",
              lineHeight: "1.75",
              letterSpacing: "0.01em",
            }}
          >
            Elevating the hobby with premium genetics and sustainable breeding practices since 2018.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              {
                name: "instagram",
                svg: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                ),
              },
              {
                name: "github",
                svg: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                ),
              },
              {
                name: "facebook",
                svg: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                ),
              },
            ].map((item) => (
              <a
                key={item.name}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(70,100,200,0.18)",
                  border: "1px solid rgba(100,140,255,0.22)",
                  color: "#7eb3ff",
                  transition: "background 0.2s, border-color 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(70,72,212,0.45)";
                  e.currentTarget.style.borderColor = "rgba(126,179,255,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(70,100,200,0.18)";
                  e.currentTarget.style.borderColor = "rgba(100,140,255,0.22)";
                }}
              >
                {item.svg}
              </a>
            ))}
          </div>
        </div>

        {/* About */}
        <div>
          <h4
            style={{
              marginBottom: "28px",
              fontSize: "0.65rem",
              fontWeight: "700",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "#4da3ff",
            }}
          >
            About
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
            {["Our Blog", "Meet The Team", "Contact Us", "Wholesale"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  style={{
                    color: "#8aa8d8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "color 0.2s",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#a5c8ff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#8aa8d8"; }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4
            style={{
              marginBottom: "28px",
              fontSize: "0.65rem",
              fontWeight: "700",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "#4da3ff",
            }}
          >
            Support
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
            {["Shipping Details", "Return Policy", "FAQ", "Privacy Policy"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  style={{
                    color: "#8aa8d8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "color 0.2s",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#a5c8ff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#8aa8d8"; }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h4
            style={{
              marginBottom: "28px",
              fontSize: "0.65rem",
              fontWeight: "700",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "#4da3ff",
            }}
          >
            Subscribe
          </h4>
          <p style={{ color: "#8aa8d8", marginBottom: "20px", fontSize: "0.92rem", lineHeight: "1.7" }}>
            Join our VIP list for early access to rare drops and care guides.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="email"
              placeholder="Email Address"
              style={{
                width: "100%",
                borderRadius: "14px",
                border: "1px solid rgba(100,140,255,0.25)",
                background: "rgba(255,255,255,0.05)",
                padding: "14px 20px",
                outline: "none",
                color: "#d0e4ff",
                fontSize: "0.9rem",
                backdropFilter: "blur(6px)",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(126,179,255,0.55)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(100,140,255,0.25)"; }}
            />
            <button
              type="button"
              style={{
                width: "100%",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #3b5af5 0%, #4b83ff 100%)",
                border: "none",
                padding: "14px",
                fontWeight: "700",
                color: "#fff",
                fontSize: "0.9rem",
                letterSpacing: "0.04em",
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(59,90,245,0.35)",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Divider line with glow */}
      <div style={{ position: "relative", zIndex: 1, margin: "0 auto", maxWidth: "1280px", padding: "0 48px" }}>
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(100,140,255,0.35) 30%, rgba(126,179,255,0.5) 50%, rgba(100,140,255,0.35) 70%, transparent)",
          }}
        />
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 48px",
        }}
      >
        <p style={{ fontSize: "0.8rem", color: "#FFFFFF", margin: 0 }}>
          © 2024 BettaVerse. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Terms of Service", "Privacy Policy", "Cookie Settings"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontSize: "0.8rem",
                color: "#FFFFFF",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#7eb3ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}