import { useState, useEffect } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

export default function PriceFilter({ filters, setFilters }) {
  const [minPrice, setMinPrice] = useState(filters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || "");

  // Sync external filter changes (e.g. reset button) to local state
  useEffect(() => {
    setMinPrice(filters.minPrice || "");
    setMaxPrice(filters.maxPrice || "");
  }, [filters.minPrice, filters.maxPrice]);

  const handleApply = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice: minPrice !== "" ? Number(minPrice) : "",
      maxPrice: maxPrice !== "" ? Number(maxPrice) : "",
    }));
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setFilters((prev) => ({
      ...prev,
      minPrice: "",
      maxPrice: "",
    }));
  };

  const isFilterActive = filters.minPrice !== "" || filters.maxPrice !== "";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold tracking-tight text-gray-900">
          <SlidersHorizontal size={16} className="text-green-600" />
          Price Range
        </h3>
        {isFilterActive && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-600"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Min (PKR)</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Max (PKR)</label>
          <input
            type="number"
            min="0"
            placeholder="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-100"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleApply}
        className="mt-4 w-full rounded-xl bg-green-700 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
      >
        Apply Price Filter
      </button>
    </div>
  );
}