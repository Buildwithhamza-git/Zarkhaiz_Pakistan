import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";

const ViewToggle = () => {
  const [view, setView] = useState("grid");

  return (
    <div className="flex shrink-0 items-center gap-1 rounded-xl border border-gray-200 p-1">
      <button
        type="button"
        onClick={() => setView("grid")}
        aria-label="Grid view"
        className={`rounded-lg p-2 transition ${
          view === "grid" ? "bg-green-600 text-white" : "text-gray-400 hover:text-green-700"
        }`}
      >
        <LayoutGrid size={18} />
      </button>

      <button
        type="button"
        onClick={() => setView("list")}
        aria-label="List view"
        className={`rounded-lg p-2 transition ${
          view === "list" ? "bg-green-600 text-white" : "text-gray-400 hover:text-green-700"
        }`}
      >
        <List size={18} />
      </button>
    </div>
  );
};

export default ViewToggle;