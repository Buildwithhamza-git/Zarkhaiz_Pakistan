import { LayoutGrid, List } from "lucide-react";

const ViewToggle = ({ filters, setFilters }) => {
  return (
    <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden">

      <button
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            view: "grid",
          }))
        }
        className={`p-3 transition ${
          filters.view === "grid"
            ? "bg-green-600 text-white"
            : "bg-white text-gray-500 hover:bg-gray-100"
        }`}
      >
        <LayoutGrid size={18} />
      </button>

      <button
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            view: "list",
          }))
        }
        className={`p-3 transition ${
          filters.view === "list"
            ? "bg-green-600 text-white"
            : "bg-white text-gray-500 hover:bg-gray-100"
        }`}
      >
        <List size={18} />
      </button>

    </div>
  );
};

export default ViewToggle;