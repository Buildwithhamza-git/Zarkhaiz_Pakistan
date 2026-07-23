import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { categories } from "../data/categories";

const CategoryFilter = () => {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("all");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-base font-bold text-gray-900">Categories</h3>
        <ChevronUp size={18} className={`text-gray-400 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {open && (
        <ul className="mt-4 space-y-1">
          {categories.map(({ id, name, icon: Icon, count }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => setActive(id)}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm transition ${
                  active === id ? "font-semibold text-green-700" : "text-gray-600 hover:text-green-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={16} className={active === id ? "text-green-700" : "text-gray-400"} />
                  {name}
                </span>
                <span className="text-xs text-gray-400">({count})</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryFilter;