import { useState, useEffect } from "react";

export default function PriceFilter({ filters, setFilters }) {
  const [price, setPrice] = useState(filters.maxPrice);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: 0,
      maxPrice: price,
    }));
  }, [price]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

      <h3 className="font-bold text-lg mb-5">
        Price Range
      </h3>

      <input
        type="range"
        min={0}
        max={50000}
        step={500}
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full accent-green-600"
      />

      <div className="flex justify-between mt-3 text-sm text-gray-500">

        <span>Rs. 0</span>

        <span>
          Rs. {price.toLocaleString()}+
        </span>

      </div>

    </div>
  );
}