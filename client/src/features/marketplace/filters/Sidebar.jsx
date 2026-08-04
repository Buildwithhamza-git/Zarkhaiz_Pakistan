import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import FeaturedFilter from "./FeaturedFilter";
import { RotateCcw } from "lucide-react";

export default function Sidebar({ filters, setFilters, resetFilters }) {
  const isAnyFilterActive =
    Boolean(filters.search) ||
    Boolean(filters.category) ||
    Boolean(filters.featured) ||
    Boolean(filters.minPrice) ||
    Boolean(filters.maxPrice);

  return (
    <aside className="w-full shrink-0 space-y-5 lg:w-[260px]">
      {isAnyFilterActive && (
        <div className="flex items-center justify-between rounded-2xl border border-green-100 bg-green-50/60 p-4">
          <span className="text-xs font-semibold text-green-800">
            Active Filters
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm transition hover:bg-green-700 hover:text-white"
          >
            <RotateCcw size={13} />
            Reset All
          </button>
        </div>
      )}

      <CategoryFilter filters={filters} setFilters={setFilters} />
      <PriceFilter filters={filters} setFilters={setFilters} />
      <FeaturedFilter filters={filters} setFilters={setFilters} />
    </aside>
  );
}