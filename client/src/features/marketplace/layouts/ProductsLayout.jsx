import Navbar from "../../Home/components/Navbar/Navbar";
import HeroSection from "./HeroSection";
import SearchBar from "../filters/SearchBar";
import CategoryTabs from "../filters/CategoryTabs";
import Sidebar from "../filters/SideBar";
import "../styles/marketplace.css";

const ProductsLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAF7]">
      <Navbar />

      <HeroSection />

      <div className="mx-auto max-w-7xl px-6">
        <div className="relative z-10 -mt-8 space-y-4">
          <SearchBar />
          <CategoryTabs />
        </div>

        <div className="flex flex-col gap-6 py-8 lg:flex-row">
          <Sidebar />

          <main className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/60 p-16">
            <p className="text-sm font-medium text-gray-400">
              Products Grid will be integrated here.
            </p>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsLayout;