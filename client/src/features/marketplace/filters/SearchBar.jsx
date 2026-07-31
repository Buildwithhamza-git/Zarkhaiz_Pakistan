import {
  Search,
  Star,
  ChevronDown,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import SortDropdown from "./SortDropdown";
import ViewToggle from "./ViewToggle";

const featuredOptions = [
  "",
  "Featured",
  "Best Selling",
  "Top Rated",
  "New Arrivals",
];

export default function SearchBar({
  filters,
  setFilters,
}) {
  const [showFeatured, setShowFeatured] =
    useState(false);

  const [searchText, setSearchText] =
    useState(filters.search);

  const featuredRef = useRef(null);

  // ---------------------------------------
  // Debounce Search
  // ---------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchText,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, setFilters]);

  // ---------------------------------------
  // Close dropdown on outside click
  // ---------------------------------------

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        featuredRef.current &&
        !featuredRef.current.contains(
          event.target
        )
      ) {
        setShowFeatured(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">

          <div className="flex flex-1 items-center gap-3">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchText}
                placeholder="Search products..."
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

          </div>

          {/* Featured Dropdown */}

          <div
            ref={featuredRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() =>
                setShowFeatured((prev) => !prev)
              }
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
            >

              <Star
                className="text-yellow-500"
                size={16}
              />

              {filters.featured || "Featured"}

              <ChevronDown
                size={16}
                className={`transition ${
                  showFeatured
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {showFeatured && (

              <div className="absolute left-0 z-30 mt-2 w-52 overflow-hidden rounded-xl border bg-white shadow-lg">

                {featuredOptions.map((item) => (

                  <button
                    key={item || "all"}
                    type="button"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        featured: item,
                      }));

                      setShowFeatured(false);
                    }}
                    className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-green-50 ${
                      filters.featured === item
                        ? "bg-green-50 font-semibold text-green-600"
                        : ""
                    }`}
                  >

                    {item || "All"}

                  </button>

                ))}

              </div>

            )}

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <SortDropdown
            filters={filters}
            setFilters={setFilters}
          />

          <ViewToggle
            filters={filters}
            setFilters={setFilters}
          />

        </div>

      </div>
    </div>
  );
}