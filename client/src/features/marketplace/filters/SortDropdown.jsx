import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ArrowDownAZ,
  ArrowUpAZ,
  Flame,
  Clock3,
  Star,
} from "lucide-react";

const OPTIONS = [
  {
    label: "Latest",
    value: "latest",
    icon: Clock3,
  },
  {
    label: "Price: Low to High",
    value: "price-low",
    icon: ArrowDownAZ,
  },
  {
    label: "Price: High to Low",
    value: "price-high",
    icon: ArrowUpAZ,
  },
  {
    label: "Top Rated",
    value: "rating",
    icon: Star,
  },
  {
    label: "Popularity",
    value: "popular",
    icon: Flame,
  },
];

export default function SortDropdown({ filters, setFilters }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const current =
    OPTIONS.find((option) => option.value === filters.sort) || OPTIONS[0];

  const CurrentIcon = current.icon;

  // Outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSortChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      sort: value,
    }));
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`
          flex
          min-w-[190px]
          items-center
          justify-between
          gap-3
          rounded-xl
          border
          bg-white
          px-4
          py-3
          text-sm
          font-medium
          shadow-sm
          outline-none
          transition-all

          ${
            open
              ? "border-green-500 ring-4 ring-green-50"
              : "border-gray-200 hover:border-green-300"
          }
        `}
      >
        <span className="flex items-center gap-2.5">
          <CurrentIcon size={17} className="text-green-600" />
          <span className="text-gray-700">{current.label}</span>
        </span>

        <ChevronDown
          size={17}
          className={`
            text-gray-400
            transition-transform
            ${open ? "rotate-180 text-green-600" : ""}
          `}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="
            absolute
            right-0
            z-50
            mt-2
            w-60
            overflow-hidden
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-1.5
            shadow-[0_15px_50px_rgba(0,0,0,0.12)]
          "
        >
          <div className="border-b border-gray-100 px-3 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Sort products
            </p>
          </div>

          <div className="mt-1">
            {OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = (filters.sort || "latest") === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSortChange(option.value)}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    transition-colors

                    ${
                      isSelected
                        ? "bg-green-50 text-green-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg

                        ${
                          isSelected
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }
                      `}
                    >
                      <Icon size={15} />
                    </span>

                    <span
                      className={`text-sm ${
                        isSelected ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {option.label}
                    </span>
                  </span>

                  {isSelected && (
                    <Check size={16} className="text-green-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}