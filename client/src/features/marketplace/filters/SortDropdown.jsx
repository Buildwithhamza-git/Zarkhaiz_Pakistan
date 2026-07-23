import { useState } from "react";
import { ChevronDown } from "lucide-react";

const options = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Popularity", value: "popular" },
];

const SortDropdown = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(false);

  const current =
    options.find((o) => o.value === filters.sort)?.label || "Newest";

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm"
      >
        {current}

        <ChevronDown
          size={16}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg z-50">

          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  sort: option.value,
                }));

                setOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left hover:bg-green-50 ${
                filters.sort === option.value
                  ? "font-semibold text-green-600"
                  : ""
              }`}
            >
              {option.label}
            </button>
          ))}

        </div>
      )}

    </div>
  );
};

export default SortDropdown;