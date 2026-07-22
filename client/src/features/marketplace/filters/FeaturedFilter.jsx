import { useState } from "react";
import { ChevronUp } from "lucide-react";

const FeaturedFilter = () => {
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-base font-bold text-gray-900">Featured</h3>
        <ChevronUp size={18} className={`text-gray-400 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {open && (
        <label className="mt-4 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked((prev) => !prev)}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">
            Featured Products <span className="text-gray-400">(45)</span>
          </span>
        </label>
      )}
    </div>
  );
};

export default FeaturedFilter;