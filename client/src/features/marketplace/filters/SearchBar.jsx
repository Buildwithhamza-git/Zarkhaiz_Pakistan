import { Search, Star, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import SortDropdown from "./SortDropdown";
import ViewToggle from "./ViewToggle";

const featuredOptions = [
  { label: "All Products", value: "" },
  { label: "Featured Only", value: "true" },
];

export default function SearchBar({ filters, setFilters }) {
  const [showFeatured, setShowFeatured] = useState(false);
  const [searchText, setSearchText] = useState(filters.search || "");
  const featuredRef = useRef(null);

  // Sync external filter changes (e.g. from URL clear or reset) to local search text
  useEffect(() => {
    setSearchText(filters.search || "");
  }, [filters.search]);

  // Debounce user typing -> update parent filters state
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchText.trim();
      if ((filters.search || "") !== trimmed) {
        setFilters((prev) => ({
          ...prev,
          search: trimmed,
        }));
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText, filters.search, setFilters]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (featuredRef.current && !featuredRef.current.contains(event.target)) {
        setShowFeatured(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleClearSearch = () => {
    setSearchText("");
    setFilters((prev) => ({ ...prev, search: "" }));
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search & Featured */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchText}
              placeholder="Search agricultural products..."
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-10 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
            {searchText && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Featured Dropdown */}
          <div ref={featuredRef} className="relative">
            <button
              type="button"
              onClick={() => setShowFeatured((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-green-300"
            >
              <Star className="text-yellow-500" size={16} />
              <span>
                {filters.featured === "true" ? "Featured" : "All Products"}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showFeatured ? "rotate-180 text-green-600" : "text-gray-400"}`}
              />
            </button>

            {showFeatured && (
              <div className="absolute left-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
                {featuredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        featured: opt.value,
                      }));
                      setShowFeatured(false);
                    }}
                    className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${
                      (filters.featured || "") === opt.value
                        ? "bg-green-50 text-green-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sorting + View Mode */}
        <div className="flex items-center gap-3">
          <SortDropdown filters={filters} setFilters={setFilters} />
          <ViewToggle filters={filters} setFilters={setFilters} />
        </div>
      </div>
    </div>
  );
}