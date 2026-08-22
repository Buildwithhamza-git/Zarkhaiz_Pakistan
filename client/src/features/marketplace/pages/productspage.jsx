import Navbar from "../../Home/components/Navbar/Navbar";

import HeroSection from "../layouts/HeroSection";
import ProductsContent from "../layouts/productsContent";

import SearchBar from "../filters/SearchBar";
import CategoryTabs from "../filters/CategoryTabs";
import Sidebar from "../filters/Sidebar";

import useMarketplaceFilters from "../hooks/useMarketplaceFilters";

import "../styles/marketplace.css";

export default function ProductsPage() {
  const { filters, setFilters, resetFilters, setPage } = useMarketplaceFilters();

  return (
    <div className="min-h-screen bg-[#F8FAF7]">
      {/* Navbar */}
      <Navbar />

      {/* Hero Banner */}
      <HeroSection />

      {/* Marketplace Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search + Categories */}
        <div className="relative z-20 -mt-8 space-y-4">
          <SearchBar filters={filters} setFilters={setFilters} />
          <CategoryTabs filters={filters} setFilters={setFilters} />
        </div>

        {/* Marketplace Body */}
        <div className="flex flex-col gap-6 py-8 lg:flex-row">
          {/* Sidebar */}
          <Sidebar
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
          />

          {/* Main Content */}
          <main className="min-w-0 flex-1">
            <ProductsContent filters={filters} setPage={setPage} />
          </main>
        </div>
      </div>
    </div>
  );
}