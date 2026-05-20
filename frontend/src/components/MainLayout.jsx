import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Container */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
