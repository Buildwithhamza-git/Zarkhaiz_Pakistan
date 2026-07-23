import { useState } from "react";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  "Newest First",
  "Price: Low to High",
  "Price: High to Low",
  "Most Popular",
  "Top Rated",
];

const SortDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Newest First");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-green-300"
      >
        <span className="text-gray-500">Sort by:</span>
        <span>{selected}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          {sortOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-green-50 ${
                option === selected ? "font-medium text-green-700" : "text-gray-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;