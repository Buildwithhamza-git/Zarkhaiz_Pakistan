import { useState } from "react";
import { Search, Star, ChevronDown } from "lucide-react";
import SortDropdown from "./SortDropdown";
import ViewToggle from "./ViewToggle";

const featuredOptions = ["Featured", "Best Selling", "Top Rated", "New Arrivals"];

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showFeatured, setShowFeatured] = useState(false);
  const [featuredOption, setFeaturedOption] = useState("Featured");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search + Featured */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              type="button"
              className="shrink-0 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Search
            </button>
          </div>

          {/* Featured dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowFeatured((prev) => !prev)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-green-300 sm:w-auto"
            >
              <span className="flex items-center gap-2">
                <Star size={16} className="text-yellow-500" />
                {featuredOption}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${showFeatured ? "rotate-180" : ""}`}
              />
            </button>

            {showFeatured && (
              <div className="absolute left-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                {featuredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setFeaturedOption(option);
                      setShowFeatured(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-green-50 ${
                      option === featuredOption ? "font-medium text-green-700" : "text-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sort + View toggle */}
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <SortDropdown />
          <ViewToggle />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;