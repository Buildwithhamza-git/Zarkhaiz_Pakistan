import { Star } from "lucide-react";

export default function FeaturedFilter({ filters, setFilters }) {
  const isFeatured = filters.featured === "true";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-bold tracking-tight text-gray-900">
        Product Type
      </h3>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                featured: e.target.checked ? "true" : "",
              }))
            }
            className="h-4 w-4 rounded border-gray-300 accent-green-600 focus:ring-green-500"
          />

          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Star size={15} className="text-yellow-500 fill-yellow-500" />
            Featured Products Only
          </span>
        </div>
      </label>
    </div>
  );
}