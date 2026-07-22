import { useState } from "react";
import { categories } from "../data/categories";

const CategoryTabs = () => {
  const [active, setActive] = useState("all");

  return (
    <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto pb-1">
      {categories.map(({ id, shortName, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setActive(id)}
          className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
            active === id
              ? "border-green-600 bg-green-600 text-white"
              : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:text-green-700"
          }`}
        >
          <Icon size={16} />
          {shortName}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;