export default function FeaturedFilter({
  filters,
  setFilters,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

      <h3 className="font-bold text-lg mb-5">
        Featured
      </h3>

      <label className="flex items-center justify-between cursor-pointer">

        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={filters.featured === "Featured"}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                featured: e.target.checked
                  ? "Featured"
                  : "",
              }))
            }
            className="h-4 w-4 accent-green-600"
          />

          <span className="text-sm">
            Featured Products
          </span>

        </div>

        <span className="text-xs text-gray-500">
          (45)
        </span>

      </label>

    </div>
  );
}