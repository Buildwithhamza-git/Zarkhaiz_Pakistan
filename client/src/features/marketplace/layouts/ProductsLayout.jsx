import { useState } from "react";

import Navbar from "../../Home/components/Navbar/Navbar";
import HeroSection from "./HeroSection";

import SearchBar from "../filters/SearchBar";
import CategoryTabs from "../filters/CategoryTabs";
import Sidebar from "../filters/Sidebar";

import ProductsPage from "../pages/ProductsPage";

import "../styles/marketplace.css";

export default function ProductsLayout() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    featured: "",
    minPrice: 0,
    maxPrice: 50000,
    sort: "newest",
    view: "grid",
  });

  return (
    <div className="min-h-screen bg-[#F8FAF7]">
      <Navbar />

      <HeroSection />

      <div className="mx-auto max-w-7xl px-6">
        {/* Search */}
        <div className="relative z-10 -mt-8 space-y-4">
          <SearchBar
            filters={filters}
            setFilters={setFilters}
          />

          <CategoryTabs
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* Main Layout */}
        <div className="flex gap-6 py-8">

          {/* Left Sidebar */}
          <Sidebar
            filters={filters}
            setFilters={setFilters}
          />

          {/* Products */}
          <main className="flex-1">
            <ProductsPage
              filters={filters}
            />
          </main>

        </div>
      </div>
    </div>
  );
}