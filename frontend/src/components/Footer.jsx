export default function Footer() {
  return (
    <footer id="about" className="mt-12 border-t border-[#c7c4d7]/30 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-4 md:px-10">
        <div className="space-y-6">
          <a href="#home" className="text-2xl font-bold text-[#4648d4]">
            BettaVerse
          </a>
          <p className="max-w-xs text-[#464554]">
            Elevating the hobby with premium genetics and sustainable breeding practices since 2018.
          </p>
          <div className="flex gap-4">
            {["social_leaderboard", "public", "camera"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef1f6] text-[#191c1e] transition-all hover:bg-[#4648d4] hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-8 text-xs font-bold uppercase tracking-[0.35em] text-[#12101a]">
            About
          </h4>
          <ul className="space-y-4 text-[#464554]">
            <li>
              <a href="#" className="transition-colors hover:text-[#4648d4]">
                Our Blog
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#4648d4]">
                Meet The Team
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#4648d4]">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#4648d4]">
                Wholesale
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-8 text-xs font-bold uppercase tracking-[0.35em] text-[#12101a]">
            Support
          </h4>
          <ul className="space-y-4 text-[#464554]">
            <li>
              <a href="#" className="transition-colors hover:text-[#4648d4]">
                Shipping Details
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#4648d4]">
                Return Policy
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#4648d4]">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#4648d4]">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-8 text-xs font-bold uppercase tracking-[0.35em] text-[#12101a]">
            Subscribe
          </h4>
          <p className="mb-6 text-[#464554]">Join our VIP list for early access to rare drops and care guides.</p>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-2xl border border-[#dfe3ea] bg-[#f2f4f6] px-6 py-4 outline-none focus:ring-2 focus:ring-[#4648d4]/20"
            />
            <button
              type="button"
              className="w-full rounded-2xl bg-[#4648d4] py-4 font-bold text-white shadow-lg shadow-[#4648d4]/20 transition-transform hover:scale-[1.02]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#c7c4d7]/20 px-4 py-8 text-xs text-[#767586] md:flex-row md:px-10">
        <p>© 2024 BettaVerse. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="transition-colors hover:text-[#4648d4]">
            Terms of Service
          </a>
          <a href="#" className="transition-colors hover:text-[#4648d4]">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-[#4648d4]">
            Cookie Settings
          </a>
        </div>
      </div>
    </footer>
  );
}
