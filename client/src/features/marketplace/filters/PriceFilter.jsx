import { useState } from "react";
import { ChevronUp } from "lucide-react";

const MIN = 0;
const MAX = 50000;
const STEP = 500;

const PriceFilter = () => {
  const [open, setOpen] = useState(true);
  const [minVal, setMinVal] = useState(MIN);
  const [maxVal, setMaxVal] = useState(MAX);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-base font-bold text-gray-900">Price Range</h3>
        <ChevronUp size={18} className={`text-gray-400 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {open && (
        <div className="mt-5">
          <div className="price-range relative h-1.5 rounded-full bg-gray-200">
            <div
              className="absolute h-1.5 rounded-full bg-green-600"
              style={{
                left: `${(minVal / MAX) * 100}%`,
                right: `${100 - (maxVal / MAX) * 100}%`,
              }}
            />

            <input
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={minVal}
              onChange={(e) => setMinVal(Math.min(Number(e.target.value), maxVal - STEP))}
              aria-label="Minimum price"
            />

            <input
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={maxVal}
              onChange={(e) => setMaxVal(Math.max(Number(e.target.value), minVal + STEP))}
              aria-label="Maximum price"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Rs. {minVal.toLocaleString()}</span>
            <span>
              Rs. {maxVal.toLocaleString()}
              {maxVal === MAX ? "+" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;